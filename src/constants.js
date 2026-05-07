export const CONFIG = {
    WORLD_SIZE: 1500,
    FPS: 60,
    
    // Snake Stats (GDD v2.1.3)
    BASE_SPEED: 4,
    DASH_MULTIPLIER: 1.5,
    ENERGY_MAX: 100,
    ENERGY_CONSUME_RATE: 33.3, // % per second
    ENERGY_STARTUP_THRESHOLD: 10, // % required to start dash
    ENERGY_ORB_VALUE: 10,
    
    // Modes
    SOLO_TIME: 90, // seconds
    
    // Collision
    HEAD_RADIUS: 15,
    
    // Visuals
    COLORS: {
        PLAYER: '#00ff88',
        AI: '#ff00ea',
        FOOD: '#ffffff',
        ENERGY: '#00f2ff',
        STONE: '#333'
    }
};
