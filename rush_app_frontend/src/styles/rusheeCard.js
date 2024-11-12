const rusheeCardStyle = (theme) => ({
    root: {
        marginBottom: theme.spacing(4),
    },
    card: {
        backgroundColor: theme.palette.primary.card
    },
    metric: {
        paddingTop: 0,
        paddingBottom: 0
    },
    cover: {
        width: "100%",
        height: "100%",
        minHeight: 250
    },
    name: {
        paddingBottom: "10px",
    },
    numberBox: {
        backgroundColor: "#3A5382",
        borderRadius: "10px",
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    number: {
        color: "#FFFFFF",
        fontFamily: 'Roboto',
    }, 

});

export default rusheeCardStyle;
