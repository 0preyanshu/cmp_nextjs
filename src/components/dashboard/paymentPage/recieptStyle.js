import { Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});


const colors = {
    orange: '#fb5741',
    lightGreen: '#DCF2ED',
    lightPeach: '#FFF9F8',
    darkPeach: '#F8E7E7',
    yellow: '#FFEEDA',
};

const styles = StyleSheet.create({
    page: {
        padding: '40px 24px 20px 24px',
        fontSize: 9,
        lineHeight: 1.6,
        fontFamily: 'Roboto',
        backgroundColor: colors.lightPeach,
    },
    topSection: {
        top_image: {
            position: 'absolute',
            top: 0,
            right: 0,
            alignItems: 'flex-end',
        },
        invoice_head: {
            fontWeight: '700',
            fontSize: '32px',
            color: colors.orange,
        },
        order_details1: {
            margin: 0,
            lineHeight: 1.5,
            fontWeight: 700,
            letterSpacing: '1.5px',
            fontSize: '14px',
        },
        order_details2: {
            margin: 0,
            lineHeight: '1.5px',
            fontWeight: 500,
            letterSpacing: '1.5px',
            fontSize: "12px"
        },
    },
    name_details: {
        marginTop: '17px',
        name: {
            fontSize: '20px',
            fontWeight: '700',
        },
        others: {
            margin: '2px 0',
            letterSpacing: '0.5px',
        },
    },
    divider: {
        width: '100%',
        height: '2px',
        borderRadius: '100px',
        backgroundColor: '#000',
    },
    participants: {
        width: '25%',
        marginTop: '5px',
    },
    participants_head: {
        fontSize: '16px',
        letterSpacing: '0.5px',
        color: colors.orange,
        fontWeight: '700',
    },
    participants_table: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: colors.yellow,
        borderBottom: '0.5px solid #646464',
    },
    rowView: {
        display: 'flex',
        flexDirection: 'row',
        border: '0.5px solid #646464',
        borderBottom: "none",
        borderLeft: 'none',
        textAlign: 'center',
        alignItems: 'center',
    },
    invoice_details: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 5,
    },
    course_details_wrapper: {
        marginTop: '15px',
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    invoice_detail_title: {
        width: '40%',
        display: 'flex',
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: colors.lightGreen,
        padding: '10px',
    },
    invoice_detail_desc: {
        width: '40%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: colors.lightGreen,
        padding: '10px',
    },
    payment_mode: {
        width: '82%',
        backgroundColor: colors.lightGreen,
        padding: '8px',
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    thank_you: {
        margin: '20px auto 10px auto',
        padding: '0 5px 0 5px',
        letterSpacing: 1.5,
        borderRadius: 4,
        backgroundColor: colors.yellow,
        fontSize: 16,
        fontWeight: '700',
    },
    thankyou_desc: {
        margin: '20px auto',
        fontFamily: "Helvetica-Oblique",
    },
    footer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    queries: {
        flexDirection: 'row',
    },
    queries_strong: {
        fontFamily: "Helvetica-BoldOblique",
    },
    copyright: {
        position: 'absolute',
        bottom: '0px',
        right: '24px',
        left: '24px',
        width: '100%',
        padding: '5px',
        fontWeight: 600,
        fontSize: 14,
        backgroundColor: colors.darkPeach,
        flexDirection: 'row',
        justifyContent: 'center',
    },
});

export default styles;
