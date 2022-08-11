import { handleActions } from 'redux-actions';

const view = handleActions(
    {
        CHANGE_ACTIVE_CATEGORY: (state, action) => ({
            ...state,
            activeCategory: action.payload.category
        }),

        CHANGE_VISIBLE_CATEGORY: (state, action) => ({
            ...state,
            visibleCategory: action.payload.category
        }),

        CHANGE_ACTIVE_INDEX: (state, action) => ({
            ...state,
            activeIndex: action.payload.index
        }),

        CHANGE_LOCATION: (state, action) => ({
            ...state,
            location: action.payload.location
        }),

        TOGGLE_PLAYLIST_SELECT_VISIBLE: (state, action) => ({
            ...state,
            playlistSelect: !action.payload.visible
        }),

        RESET_VIEW: (state) => ({
            ...state,
            activeCategory: 'songs',
            activeIndex: undefined
        }),

        OPEN_MODAL_MESSAGE: (state, action) => ({
            ...state,
            messageConfig: action.payload.messageConfig
        }),

        CLOSE_MODAL_MESSAGE: (state, action) => ({
            ...state,
            messageConfig: { text: '' }
        }),

        TOGGLE_MODAL_MESSAGE: (state, action) => ({
            ...state,
            modalVisible: !action.payload.visible
        })

    },
    {
        activeCategory: 'songs',
        visibleCategory: 'songs',
        activeIndex: undefined,
        playlistSelect: false,
        messageConfig: {},
        modalVisible: false,
        location: '/'
    }
)

export { view as default }
