export function Hero({ peeking = false, done = false}: { peeking?: boolean, done?: boolean}) {
    return (
        <>
        {/* Desktop Ver. */}
        <div className={`hidden md:flex fixed left-0 right-0 z-30 flex-col items-center select-none pointer-events-none transition-all duration-700 ease-out ${done ? 'opacity-0' : 'opacity-100'}`}
            style={{
                bottom: '-20px',
                transform: peeking ? 'translateY(-50px)' : 'translateY(180px)'
            }}>
                <div className="flex gap-6 text-sm font-[500] tracking-[0.25em] text-white uppercase mb-6 drop-shadow-[0_0_8px_rgba(255, 255, 255, 0.6)]">
                    <span>Desliza para continuar</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-white">
                    <span className="block h-8 w-[2px] bg-gradient-to-b from-transparent via-white drop-shadow-[0_0_6px_rgba(255, 255, 255, 0.6)]" />
                    <svg className="h-6 w-6 animate-bounce drop-shadow-[0_0_8px_rgba(255, 255, 255, 0.6)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14m0 0-6-6m6 6 6-6" />
                    </svg>
                </div>
            </div>
        {/* Mobile Ver. - Animates UP from off-screen */}
        </>
    )
}