import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document } from '@react-pdf/renderer';
import { formatDateTime } from '@/utils/formatTime';
import styles from './recieptStyle';

const tableColumns = ['Name', 'Email', 'Event', 'Date'];

export default function RecieptPDF({ orderDetails }) {
    const {
        buyerName = 'N/A',
        buyerEmail = 'N/A',
        buyerPhoneNo = 'N/A',
        transactionId = 'N/A',
        numberOfParticipants = 0,
        totalAmount = 0,
        currencyType = 'N/A',
        currencySymbol = '',
        eventName = 'N/A',
        instructorName = 'N/A',
        eventStartDate = 'N/A',
        eventEndDate = 'N/A',
        timeZoneShortName = 'N/A',
        courseLogoUrl = 'https://via.placeholder.com/150',
        orderParticipantDTOS = [],
        orderDate = 'N/A',
        calculatedAmount= 0,
        eventAmount= 0,
        taxAmount=0,
        couponAmount=0,
    } = orderDetails;

//     calculatedAmount
// : 
// 17920
// couponAmount
// : 
// 4000
// eventAmount
// : 
// 10000
// noOfParticipants
// : 
// 2
// taxAmount
// : 
// 1920
    const getColumnData = (rowIndex, colIndex) => {
        switch (colIndex) {
            case 0:
                return `${orderParticipantDTOS[rowIndex]?.participantFirstName || 'N/A'} ${orderParticipantDTOS[rowIndex]?.participantLastName || ''}`;
            case 1:
                return orderParticipantDTOS[rowIndex]?.participantEmail || 'N/A';
            case 2:
                return eventName;
            case 3:
                return orderParticipantDTOS[rowIndex]?.createdAt
                    ? formatDateTime(orderParticipantDTOS[rowIndex]?.createdAt)
                    : 'N/A';
            default:
                return 'N/A';
        }
    };

    return (
        <Document>
            <Page size={'A4'} style={styles.page}>
                <View style={styles.topSection}>
                    <View>
                        <Text style={styles.topSection.invoice_head}>INVOICE</Text>
                        <Text style={styles.topSection.order_details1}>ORDER ID: {transactionId}</Text>
                        <Text style={styles.topSection.order_details2}>
                            ORDER DATE: {orderDate && formatDateTime(orderDate)}
                        </Text>
                    </View>
                    <View style={styles.topSection.top_image}>
                        <Image src="/assets/logo_full.png" style={{ height: 32, width: 200 }} />
                        <Text style={{ fontWeight: 900, fontSize: '12px', color: "#000" }}>BN: 76rtas8d6f</Text>
                    </View>
                </View>
                <View style={styles.name_details}>
                    <Text style={styles.name_details.name}>{buyerName}</Text>
                    <Text style={styles.name_details.others}>{buyerEmail}</Text>
                    <Text style={styles.name_details.others}>{buyerPhoneNo}</Text>
                </View>
                <View style={styles.participants}>
                    <Text style={styles.participants_head}>PARTICIPANTS</Text>
                    <View style={styles.divider} />
                </View>

                <View style={styles.participants_table}>
                    <View style={styles.rowView}>
                        {tableColumns.map((c) => (
                            <Text
                                key={c}
                                style={{
                                    width: `${100 / tableColumns.length}%`,
                                    paddingVertical: 8,
                                    borderLeft: '0.5px solid #404040',
                                    fontWeight: 700,
                                    textDecoration: 'underline',
                                    fontSize: 12,
                                }}
                            >
                                {c}
                            </Text>
                        ))}
                    </View>
                    {orderParticipantDTOS?.map((rowData, rowIndex) => (
                        <View style={styles.rowView} key={rowIndex}>
                            {tableColumns.map((c, colIndex) => (
                                <Text key={colIndex + c} style={{ width: `${100 / tableColumns.length}%`, height: '100%', padding: 8, borderLeft: '0.5px solid #404040' }}>
                                    {getColumnData(rowIndex, colIndex)}
                                </Text>
                            ))}
                        </View>
                    ))}
                </View>
                <View style={styles.divider} />
                <View style={styles.course_details_wrapper}>
                    <View style={styles.invoice_details}>
                        <View style={styles.invoice_detail_title}>
                            <Text style={{ fontWeight: 600, fontSize: '10px' }}>Course Price</Text>
                        </View>
                        <View style={styles.invoice_detail_desc}>
                            <Text>{numberOfParticipants} X {currencySymbol}{eventAmount} = {currencySymbol}{eventAmount*numberOfParticipants} {currencyType}</Text>
                        </View>
                    </View>
                    {couponAmount > 0 && <>
                        <View style={styles.invoice_details}>
                        <View style={styles.invoice_detail_title}>
                            <Text style={{ fontWeight: 600, fontSize: '10px' }}>Coupon Amount</Text>
                        </View>
                        <View style={styles.invoice_detail_desc}>
                            <Text>{"- "+currencySymbol}{couponAmount} {currencyType}</Text>
                        </View>
                    </View>
                    </>}
                    <View style={styles.invoice_details}>
                        <View style={styles.invoice_detail_title}>
                            <Text style={{ fontWeight: 600, fontSize: '10px' }}>Subtotal</Text>
                        </View>
                        <View style={styles.invoice_detail_desc}>
                            <Text>{currencySymbol}{eventAmount*numberOfParticipants-couponAmount} {currencyType}</Text>
                        </View>
                    </View>

                    {taxAmount > 0 && <>
                        <View style={styles.invoice_details}>
                        <View style={styles.invoice_detail_title}>
                            <Text style={{ fontWeight: 600, fontSize: '10px' }}>Tax</Text>
                        </View>
                        <View style={styles.invoice_detail_desc}>
                            <Text>{currencySymbol}{taxAmount} {currencyType}</Text>
                        </View>
                    </View>
                    </>}
                   
                    <View style={styles.invoice_details}>
                        <View style={styles.invoice_detail_title}>
                            <Text style={{ fontWeight: 600, fontSize: '10px' }}>Grand Total</Text>
                        </View>
                        <View style={styles.invoice_detail_desc}>
                            <Text>{currencySymbol}{calculatedAmount} {currencyType}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.thank_you}>
                    <Text>THANK YOU FOR YOUR ORDER!</Text>
                </View>
                <View style={[styles.queries, styles.thankyou_desc]}>
                    <Text>Your Statement will indicate the charge from </Text>
                    <Text style={styles.queries_strong}>'Skillbook Inc'</Text>
                </View>
                <View style={styles.footer}>
                    <Text>For any queries:</Text>
                    <View style={styles.queries}>
                        <Text>Email us at: </Text>
                        <Text style={{ fontWeight: 700 }}>support@skillbook.com</Text>
                        <Text> or</Text>
                    </View>
                    <View style={styles.queries}>
                        <Text>Call </Text>
                        <Text style={{ fontWeight: 700 }}>470-816-0006</Text>
                        <Text> with your order details</Text>
                    </View>
                </View>
                <View style={styles.copyright}>
                    <Text>©2023 SKILLBOOK ACADEMY. ALL RIGHTS RESERVED.</Text>
                </View>
            </Page>
        </Document>
    );
}

// RecieptPDF.propTypes = {
//     orderDetails: PropTypes.shape({
//         buyerName: PropTypes.string,
//         buyerEmail: PropTypes.string,
//         buyerPhoneNo: PropTypes.string,
//         transactionId: PropTypes.string,
//         numberOfParticipants: PropTypes.number,
//         totalAmount: PropTypes.number,
//         currencyType: PropTypes.string,
//         currencySymbol: PropTypes.string,
//         eventName: PropTypes.string,
//         instructorName: PropTypes.string,
//         eventStartDate: PropTypes.string,
//         eventEndDate: PropTypes.string,
//         timeZoneShortName: PropTypes.string,
//         courseLogoUrl: PropTypes.string,
//         orderParticipantDTOS: PropTypes.arrayOf(
//             PropTypes.shape({
//                 participantFirstName: PropTypes.string,
//                 participantLastName: PropTypes.string,
//                 participantEmail: PropTypes.string,
//                 createdAt: PropTypes.string,
//             })
//         )
//     }).isRequired,
// };
