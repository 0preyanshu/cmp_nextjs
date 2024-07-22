'use client'
import { useState } from 'react';
import moment from 'moment';
import { TextField, Skeleton } from '@mui/material';
// import { useSnackbar } from 'notistack';
import styles from './PaymentSummary.module.css';  // Import the CSS module

export default function PaymentSummary() {

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    attendees: 1,
    coupon: '',
  });
  const [priceDetails, setPriceDetails] = useState({
    currencyName: 'USD',
    currencyLogo: '$',
    price: 100,
    regularPrice: 120,
    couponDiscount: 0,
    subtotal: 100,
    taxAndCharges: 10,
    totalAmount: 110,
  });
  const event = {
    eventId: 1,
    eventName: 'React Workshop',
    instructorName: 'John Doe',
    classStartDate: '2024-08-01T10:00:00',
    classEndDate: '2024-08-05T10:00:00',
    timezoneShortName: 'PST',
    courseLogo: '/images/course-logo.png',
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    // Mock coupon application logic
    if (data.coupon === 'DISCOUNT10') {
      const discount = 10;
      const newPrice = priceDetails.price - discount;
      setPriceDetails({
        ...priceDetails,
        couponDiscount: discount,
        subtotal: newPrice,
        totalAmount: newPrice + priceDetails.taxAndCharges,
      });
      // enqueueSnackbar('Coupon code applied successfully', { variant: 'success' });
    } else {
      // enqueueSnackbar('Invalid Coupon!', { variant: 'error' });
    }
  };

  return (
    <div className={styles.card}>
      {loading ? (
        <Skeleton variant="rectangular" width={210} height={118} />
      ) : (
        <div className={styles.head_wrapper}>
          <div className={styles.head_content}>
            <div className={styles.course_name}>
              {event?.eventName}
            </div>
            <div className={styles.trainer}>
              Trainer: <span>{event?.instructorName}</span>
            </div>
            <div className={styles.date}>
              {moment(event?.classStartDate).format("MMM DD")} - {moment(event?.classEndDate).format("MMM DD YYYY")}. {moment(event?.classStartDate).format("ddd")}-{moment(event?.classEndDate).format("ddd")} ({moment(event?.classEndDate).diff(moment(event?.classStartDate), "day")} Days)
            </div>
            <div className={styles.time}>
              {moment(event?.classStartDate).format("hh:mm A")} - {moment(event?.classEndDate).format("hh:mm A")} ({event?.timezoneShortName})
            </div>
          </div>
          <img className={styles.logo} src={event?.courseLogo} alt="logo" />
        </div>
      )}

      <div className={styles.border} />

      <div className={styles.pricing}>
        <div className={styles.promo}>Promo Code</div>
        <form className={styles.input} onSubmit={(event) => applyCoupon(event)}>
          <TextField size='large' fullWidth label="Enter Promo Code" name="promo" onChange={(e) => setData({ ...data, coupon: e.target.value })} required value={data?.coupon} />
          <button className={styles.promo_button} type='submit'>Apply</button>
        </form>

        {loading ? (
          <Skeleton variant="rectangular" width={210} height={118} />
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.heading}>Last Few Special</div>
              <div className={styles.price}>
                {priceDetails?.currencyName} {priceDetails?.currencyLogo}{priceDetails?.price} {priceDetails?.price !== priceDetails?.regularPrice && <span className={styles.strike}>{priceDetails?.currencyLogo}{priceDetails?.regularPrice}</span>}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.heading}>Number of attendees</div>
              <div className={styles.price}>
                {data?.attendees}
              </div>
            </div>
            {priceDetails?.couponDiscount > 0 &&
              <div className={styles.row}>
                <div className={styles.heading}>Coupon Discount</div>
                <div className={styles.price} style={{ color: '#FB5741' }}>
                  -{priceDetails?.currencyLogo}{priceDetails?.couponDiscount}
                </div>
              </div>
            }
            <div className={styles.row}>
              <div className={styles.heading}>Sub Total</div>
              <div className={styles.price}>
                {priceDetails?.currencyName} {priceDetails?.currencyLogo}{priceDetails?.subtotal}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.heading}>Tax and charges</div>
              <div className={styles.price}>
                {priceDetails?.currencyName} {priceDetails?.currencyLogo}{priceDetails?.taxAndCharges}
              </div>
            </div>
          </>
        )}
      </div>
      <div className={styles.border} />
      {loading ? (
        <div className={styles.total}>
          <Skeleton height={30} width={40} />
          <Skeleton height={30} width={60} />
        </div>
      ) : (
        <div className={styles.total}>
          <div>Total</div>
          <div>{priceDetails?.currencyName} {priceDetails?.currencyLogo}{priceDetails?.totalAmount}</div>
        </div>
      )}
    </div >
  );
}
