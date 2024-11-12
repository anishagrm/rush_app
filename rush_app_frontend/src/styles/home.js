const homeStyle = (theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    logo : {
        height: 40,
        paddingRight: 10,
    },
    secret: {
        maxWidth: '100%'
    },
    center: {
        width: '50%',
        margin: '0 auto'
    },
    section: {
        marginTop: theme.spacing(4)
    }
});

export default homeStyle;