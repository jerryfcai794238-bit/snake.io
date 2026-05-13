export const CONFIG = {
    WORLD_SIZE: 2000,
    FPS: 60,
    SOLO_TIME: 150, // 延長至 150s (v3.5.9)
    HEAD_RADIUS: 15,

    // Snake Stats (GDD v2.2.0)
    BASE_SPEED: 4,
    DASH_MULTIPLIER: 1.25, // 下修至提升 25% (v3.1.12)
    INITIAL_LENGTH: 50,
    STAMINA_MAX: 100,
    STAMINA_DRAIN_SPEED: 33.3, // 100/3s
    STAMINA_REGEN_SPEED: 6.67, // 100/15s
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
