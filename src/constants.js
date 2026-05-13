export const CONFIG = {
    WORLD_SIZE: 2200, // 擴大至 2200x2200 (v4.0)
    FPS: 60,
    SOLO_TIME: 150, 
    HEAD_RADIUS: 15,

    // Snake Stats (GDD v2.2.0)
    BASE_SPEED: 4,
    DASH_MULTIPLIER: 1.25,
    INITIAL_LENGTH: 50,
    STAMINA_MAX: 100,
    STAMINA_DRAIN_SPEED: 33.3, 
    STAMINA_REGEN_SPEED: 6.67, 
    RESPAWN_TIME: 3000, 

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
    },

    // 隨機道具系統參數 (v4.0)
    ITEM_TYPES: {
        HOURGLASS: { type: 'RECOVERY', name: '時光沙漏', color: '#00FFFF', icon: '⏳', instant: true },
        SODA: { type: 'RECOVERY', name: '活力蘇打', color: '#00FF00', icon: '🥤', instant: true },
        VORTEX: { type: 'RESOURCE', name: '磁力漩渦', color: '#BC13FE', icon: '🌀', instant: true, radius: 400 },
        LUCKY7: { type: 'RESOURCE', name: '幸運7', color: '#FFFF00', icon: '7', duration: 10, multiplier: 7 },
        MUSHROOM: { type: 'COMBAT', name: '巨大蘑菇', color: '#FF0000', icon: '🍄', duration: 10, sizeMod: 1.5, speedMod: 0.75 },
        CLOAK: { type: 'COMBAT', name: '幽靈披風', color: '#AAAAAA', icon: '👻', duration: 10 }
    },
    ITEM_SPAWN_INTERVAL: 3000, 
    ITEM_MAX_COUNT: 12,        
    ITEM_TEASER_TIME: 3.0      
};
