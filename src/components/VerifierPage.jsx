/**
 * VerifierPage - AI Model Verification Dashboard
 * 
 * Displays execution history, allows model selection, and enables human review
 * of AI agent task completions.
 */

import { useState, useEffect, useCallback } from 'react';

// API base URL
const API_BASE = 'http://localhost:3001';

// Supported AI Models for testing
const MODELS = [
    { id: 'gemini-computer-use', name: 'Gemini Computer Use', description: 'Google\'s vision-based agent' },
    { id: 'claude-computer-use', name: 'Claude Computer Use', description: 'Anthropic\'s computer control' },
    { id: 'gpt-4-vision', name: 'GPT-4 Vision', description: 'OpenAI\'s vision model' },
    { id: 'mock', name: 'Mock (No API)', description: 'Test without API calls' },
];

// Task definitions
const TASKS = [
    {
        id: 'CREATE_PLAYLIST_ADD_SONG_PLAY',
        name: 'Create Playlist & Play Song',
        prompt: 'Create a playlist on the Spotify clone, add a music to it and play it.',
        hints: [
            'Click the "Create" button in the sidebar',
            'Select "Playlist" from the dropdown',
            'Navigate to an existing playlist to find songs',
            'Use the "..." menu to add songs to your new playlist',
            'Navigate to your new playlist and play the song',
        ],
    },
];

function VerifierPage() {
    const [selectedModel, setSelectedModel] = useState('gemini-computer-use');
    const [selectedTask, setSelectedTask] = useState(TASKS[0]);
    const [executions, setExecutions] = useState([]);
    const [selectedExecution, setSelectedExecution] = useState(null);
    const [screenshots, setScreenshots] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [apiConnected, setApiConnected] = useState(false);
    const [error, setError] = useState(null);

    // Fetch executions from API
    const fetchExecutions = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/executions`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setExecutions(data.executions || []);
            setApiConnected(true);
            setError(null);
        } catch (err) {
            console.error('API not available:', err);
            setApiConnected(false);
            setError('API server not running. Start it with: node executor/api-server.js');
        }
    }, []);

    // Fetch screenshots for selected execution
    const fetchScreenshots = useCallback(async (executionId) => {
        try {
            const response = await fetch(`${API_BASE}/api/executions/${executionId}/screenshots`);
            if (!response.ok) return;
            const data = await response.json();
            setScreenshots(data.screenshots || []);
        } catch (err) {
            console.error('Failed to fetch screenshots:', err);
            setScreenshots([]);
        }
    }, []);

    // Initial fetch and polling
    useEffect(() => {
        fetchExecutions();
        const interval = setInterval(fetchExecutions, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, [fetchExecutions]);

    // Fetch screenshots when execution is selected
    useEffect(() => {
        if (selectedExecution) {
            fetchScreenshots(selectedExecution.id);
        }
    }, [selectedExecution, fetchScreenshots]);

    // Calculate success rate
    const successRate = executions.length > 0
        ? Math.round((executions.filter(e => e.score === 1).length / executions.length) * 100)
        : 0;

    const handleRunExecution = async () => {
        if (!apiConnected) {
            setError('API server not running. Start it first.');
            return;
        }
        setIsRunning(true);
        try {
            const response = await fetch(`${API_BASE}/api/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    taskType: selectedTask.id
                }),
            });
            if (!response.ok) throw new Error('Failed to start execution');
            console.log(`Execution started with model: ${selectedModel}`);
            // Polling will pick up the new execution
        } catch (err) {
            console.error('Failed to start execution:', err);
            setError('Failed to start execution');
        } finally {
            setTimeout(() => setIsRunning(false), 3000); // Keep running state for visibility
        }
    };

    const handleHumanReview = async (executionId, decision) => {
        try {
            const response = await fetch(`${API_BASE}/api/executions/${executionId}/review`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decision }),
            });
            if (!response.ok) throw new Error('Failed to save review');

            // Update local state optimistically
            setExecutions(executions.map(e =>
                e.id === executionId
                    ? { ...e, humanReview: { decision, timestamp: new Date().toISOString() } }
                    : e
            ));
            // Update selected execution too
            if (selectedExecution?.id === executionId) {
                setSelectedExecution({
                    ...selectedExecution,
                    humanReview: { decision, timestamp: new Date().toISOString() }
                });
            }
        } catch (err) {
            console.error('Failed to save review:', err);
            setError('Failed to save review');
        }
    };

    return (
        <div className="p-6 min-h-full">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-3xl font-bold text-white mb-2">AI Model Verifier</h1>
                <p className="text-gray-400">Test and verify AI agent task completion</p>
            </div>

            {/* API Status / Error Banner */}
            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-center gap-2">
                    <span className="text-red-400">⚠</span>
                    <span className="text-red-300 text-sm">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300">✕</button>
                </div>
            )}
            <div className="mb-8 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-gray-400">
                    {apiConnected ? 'API Connected' : 'API Disconnected'}
                </span>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-white">{executions.length}</div>
                    <div className="text-gray-400 text-sm">Total Executions</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-green-500">{executions.filter(e => e.score === 1).length}</div>
                    <div className="text-gray-400 text-sm">Passed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-red-500">{executions.filter(e => e.score === 0).length}</div>
                    <div className="text-gray-400 text-sm">Failed</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-3xl font-bold text-blue-400">{successRate}%</div>
                    <div className="text-gray-400 text-sm">Success Rate</div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Task & Model Selection */}
                <div className="space-y-6">
                    {/* Task Card */}
                    <div className="bg-white/5 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-white mb-4">Current Task</h2>
                        <div className="bg-black/30 rounded-lg p-4 mb-4">
                            <h3 className="text-white font-medium mb-2">{selectedTask.name}</h3>
                            <p className="text-gray-300 text-sm mb-3">"{selectedTask.prompt}"</p>
                            <div className="space-y-1">
                                <div className="text-xs text-gray-500 uppercase font-medium">Hints:</div>
                                {selectedTask.hints.map((hint, i) => (
                                    <div key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        <span>{hint}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Model Selector */}
                    <div className="bg-white/5 rounded-lg p-5">
                        <h2 className="text-lg font-semibold text-white mb-4">Select Model</h2>
                        <div className="space-y-2">
                            {MODELS.map(model => (
                                <label
                                    key={model.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedModel === model.id
                                        ? 'bg-green-500/20 border border-green-500/50'
                                        : 'bg-black/30 hover:bg-white/10'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="model"
                                        value={model.id}
                                        checked={selectedModel === model.id}
                                        onChange={(e) => setSelectedModel(e.target.value)}
                                        className="mt-1 accent-green-500"
                                    />
                                    <div>
                                        <div className="text-white font-medium text-sm">{model.name}</div>
                                        <div className="text-gray-400 text-xs">{model.description}</div>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Run Button */}
                        <button
                            onClick={handleRunExecution}
                            disabled={isRunning}
                            className={`w-full mt-4 py-3 px-4 rounded-full font-semibold transition-all ${isRunning
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-green-500 text-black hover:bg-green-400 hover:scale-105'
                                }`}
                        >
                            {isRunning ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Running...
                                </span>
                            ) : (
                                'Run Execution'
                            )}
                        </button>
                    </div>
                </div>

                {/* Middle Column - Execution History */}
                <div className="bg-white/5 rounded-lg p-5">
                    <h2 className="text-lg font-semibold text-white mb-4">Execution History</h2>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto hide-scrollbar">
                        {executions.map(execution => (
                            <div
                                key={execution.id}
                                onClick={() => setSelectedExecution(execution)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedExecution?.id === execution.id
                                    ? 'bg-white/20 border border-white/30'
                                    : 'bg-black/30 hover:bg-white/10'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${execution.score === 1 ? 'bg-green-500' : 'bg-red-500'}`} />
                                        <span className="text-white font-medium text-sm">
                                            {execution.score === 1 ? 'PASS' : 'FAIL'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(execution.startTime).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400 mb-1">
                                    Model: {MODELS.find(m => m.id === execution.model)?.name || execution.model}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Steps: {execution.stepsCompleted}/{execution.totalSteps}
                                </div>
                                {execution.humanReview && (
                                    <div className={`mt-2 text-xs px-2 py-1 rounded inline-block ${execution.humanReview.decision === 'pass'
                                        ? 'bg-green-500/20 text-green-400'
                                        : 'bg-red-500/20 text-red-400'
                                        }`}>
                                        Human: {execution.humanReview.decision.toUpperCase()}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Execution Details */}
                <div className="bg-white/5 rounded-lg p-5">
                    <h2 className="text-lg font-semibold text-white mb-4">Execution Details</h2>

                    {selectedExecution ? (
                        <div className="space-y-4">
                            {/* Status */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`text-4xl ${selectedExecution.score === 1 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedExecution.score === 1 ? '✓' : '✗'}
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">
                                        Score: {selectedExecution.score}/1
                                    </div>
                                    <div className="text-gray-400 text-sm">
                                        {selectedExecution.passed ? 'All checks passed' : 'Some checks failed'}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-black/30 rounded-lg p-3 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Execution ID</span>
                                    <span className="text-white font-mono text-xs">{selectedExecution.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Model</span>
                                    <span className="text-white">{MODELS.find(m => m.id === selectedExecution.model)?.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Duration</span>
                                    <span className="text-white">
                                        {Math.round((new Date(selectedExecution.endTime) - new Date(selectedExecution.startTime)) / 1000)}s
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Steps</span>
                                    <span className="text-white">{selectedExecution.stepsCompleted}/{selectedExecution.totalSteps}</span>
                                </div>
                            </div>

                            {/* Screenshot Timeline */}
                            <div className="bg-black/50 rounded-lg p-4">
                                <div className="text-gray-500 text-sm mb-3">Screenshot Timeline</div>
                                {screenshots.length > 0 ? (
                                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                                        {screenshots.map((ss, i) => (
                                            <img
                                                key={i}
                                                src={`${API_BASE}${ss.url}`}
                                                alt={`Step ${i + 1}`}
                                                className="w-24 h-16 object-cover rounded border border-white/10 hover:border-green-500/50 transition-colors cursor-pointer flex-shrink-0"
                                                onClick={() => window.open(`${API_BASE}${ss.url}`, '_blank')}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex gap-2 justify-center">
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className="w-16 h-12 bg-white/10 rounded flex items-center justify-center">
                                                <span className="text-xs text-gray-500">{i + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="text-gray-600 text-xs mt-2 text-center">
                                    {screenshots.length} screenshots
                                </div>
                            </div>

                            {/* Human Review */}
                            <div className="pt-4 border-t border-white/10">
                                <div className="text-sm text-gray-400 mb-3">Human Review</div>
                                {selectedExecution.humanReview ? (
                                    <div className={`p-3 rounded-lg ${selectedExecution.humanReview.decision === 'pass'
                                        ? 'bg-green-500/20 border border-green-500/50'
                                        : 'bg-red-500/20 border border-red-500/50'
                                        }`}>
                                        <span className="text-white font-medium">
                                            {selectedExecution.humanReview.decision === 'pass' ? '✓ Approved' : '✗ Rejected'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleHumanReview(selectedExecution.id, 'pass')}
                                            className="flex-1 py-2 px-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/50 hover:bg-green-500/30 transition-colors font-medium"
                                        >
                                            ✓ Approve
                                        </button>
                                        <button
                                            onClick={() => handleHumanReview(selectedExecution.id, 'fail')}
                                            className="flex-1 py-2 px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-colors font-medium"
                                        >
                                            ✗ Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 py-12">
                            <div className="text-4xl mb-3">📋</div>
                            <div>Select an execution to view details</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifierPage;
