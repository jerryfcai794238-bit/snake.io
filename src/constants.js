export const CONFIG = {
    WORLD_SIZE: 1200,
    FPS: 60,
    SOLO_TIME: 90,
    HEAD_RADIUS: 15,
    
    // Snake Stats (GDD v2.2.0)
    BASE_SPEED: 4,
    DASH_MULTIPLIER: 1.5,
    INITIAL_LENGTH: 50,
    DASH_LENGTH_CONSUME_RATE: 40, // Length per second
    RESPAWN_TIME: 3000, // ms
    
    FOOD_TYPES: {
        SMALL: { value: 2, size: 4 },
        MEDIUM: { value: 5, size: 7 },
        LARGE: { value: 10, size: 10 }
    },

    COLORS: {
        PLAYER: '#00FF88',
        AI: '#FF44CC',
        STONE: '#222',
        STONE_BORDER: '#FF0000',
        FOOD: '#FFD700',
        BOUNDARY: '#FF0000'
    }
};
