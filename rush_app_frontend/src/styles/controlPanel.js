const controlPanelStyle = (theme) => ({

    clouds: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    sort: {
        marginTop: 10,
    },
    search: {
        display: 'flex',
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    icon: {
        color: theme.palette.secondary.main,
    },
    tbutton : {
        width: '100%'
    },
    top : {
        backgroundColor: theme.palette.primary.main,
    },
    profile: {
        height: 120,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    settings: {
        color: theme.palette.primary.settings,
    },

    propic: {
        marginTop: 50,
        width: 150,
        height: 150
    },
    panel: {
        paddingTop: 60,
        backgroundColor: theme.palette.primary.card

    },
    buttons: {
        marginTop: 10
    }
});

export default controlPanelStyle;