// components/ui/StepTimeline.tsx
interface TimelineStep {
    label: string;
    status: "completed" | "current" | "pending";
    timestamp?: string;
    description?: string;
}

interface StepTimelineProps {
    steps: TimelineStep[];
}

export function StepTimeline({ steps }: StepTimelineProps) {
    return (
        <div className="relative space-y-4">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;

                return (
                    <div key={index} className="relative flex gap-4">
                        {/* Timeline line */}
                        {!isLast && (
                            <div className="absolute left-4 top-8 h-full w-0.5 bg-slate-800" />
                        )}

                        {/* Step indicator */}
                        <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-slate-950">
                            {step.status === "completed" ? (
                                <div className="h-4 w-4 rounded-full bg-emerald-500 border-2 border-emerald-500" />
                            ) : step.status === "current" ? (
                                <div className="h-4 w-4 rounded-full bg-blue-500 border-2 border-blue-500 animate-pulse" />
                            ) : (
                                <div className="h-4 w-4 rounded-full bg-slate-700 border-2 border-slate-700" />
                            )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 pb-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className={`font-medium ${step.status === "completed" ? "text-slate-100" :
                                            step.status === "current" ? "text-blue-400" :
                                                "text-slate-500"
                                        }`}>
                                        {step.label}
                                    </p>
                                    {step.description && (
                                        <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                                    )}
                                </div>
                                {step.timestamp && (
                                    <span className="text-xs text-slate-500">{step.timestamp}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
