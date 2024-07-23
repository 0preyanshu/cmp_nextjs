'use client'
import { useState, useEffect } from 'react';
import moment from 'moment';
import { TextField, Skeleton } from '@mui/material';
import styles from './PaymentSummary.module.css';  // Import the CSS module

export default function PaymentSummary({ data, orderInfo, currency, fetchedEvent, loading, fetchCoupon }) {
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    console.log("orderInfo", orderInfo);
  }, [orderInfo]);

  const [priceDetails, setPriceDetails] = useState({
    currencyName: 'USD',
    currencyLogo: '$',
    price: 0,
    regularPrice: 0,
    couponDiscount: 0,
    subtotal: 0,
    taxAndCharges: 0,
    totalAmount: 0,
  });

  const [event, setEvent] = useState({
    eventId: 1,
    eventName: 'React Workshop',
    instructorName: 'John Doe',
    classStartDate: '2024-08-01T10:00:00',
    classEndDate: '2024-08-05T10:00:00',
    timezoneShortName: 'PST',
    courseLogo: '/images/course-logo.png',
  });

  useEffect(() => {
    setPriceDetails({
      currencyName: currency?.currencyName || 'USD',
      currencyLogo: currency?.currencyLogo || '$',
      price: orderInfo?.calculatedAmount || 0,
      regularPrice: orderInfo?.calculatedAmount || 0,
      couponDiscount: orderInfo?.couponDiscount || 0,
      subtotal: orderInfo?.calculatedAmount || 0,
      taxAndCharges: orderInfo?.taxAmount || 0,
      totalAmount: orderInfo?.calculatedAmount || 0,
    });

    setEvent({
      eventId: fetchedEvent?.eventId || 1,
      eventName: fetchedEvent?.eventName || 'React Workshop',
      instructorName: 'John Doe',
      classStartDate: fetchedEvent?.eventStartDate || '2024-08-01T10:00:00',
      classEndDate: fetchedEvent?.eventEndDate || '2024-08-05T10:00:00',
      timezoneShortName: 'PST',
      courseLogo: '/images/course-logo.png',
    });

    console.log("fetchedEvent", fetchedEvent);

  }, [orderInfo, currency, fetchedEvent]);

  const applyCoupon = async (e) => {
    e.preventDefault();
    try {
      if (coupon) {
        await fetchCoupon(coupon);
        // orderInfo will automatically get updated, triggering the useEffect to update price details
      }
    } catch (error) {
      console.error("Error applying coupon: ", error);
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
              {event.eventName}
            </div>
            <div className={styles.trainer}>
              Trainer: <span>{event.instructorName}</span>
            </div>
            <div className={styles.date}>
              {moment(event.classStartDate).format("MMM DD")} - {moment(event.classEndDate).format("MMM DD YYYY")}. {moment(event.classStartDate).format("ddd")}-{moment(event.classEndDate).format("ddd")} ({moment(event.classEndDate).diff(moment(event.classStartDate), "day")} Days)
            </div>
            <div className={styles.time}>
              {moment(event.classStartDate).format("hh:mm A")} - {moment(event.classEndDate).format("hh:mm A")} ({event.timezoneShortName})
            </div>
          </div>
          <img className={styles.logo} src={event.courseLogo} alt="logo" />
        </div>
      )}

      <div className={styles.border} />

      <div className={styles.pricing}>
        <div className={styles.promo}>Promo Code</div>
        <form className={styles.input} onSubmit={applyCoupon}>
          <TextField
            size='large'
            fullWidth
            label="Enter Promo Code"
            name="promo"
            onChange={(e) => setCoupon(e.target.value)}
            required
            value={coupon}
          />
          <button className={styles.promo_button} type='submit'>Apply</button>
        </form>

        {loading ? (
          <Skeleton variant="rectangular" width={210} height={118} />
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.heading}>Last Few Special</div>
              <div className={styles.price}>
                {priceDetails.currencyName} {priceDetails.currencyLogo}{priceDetails.price} {priceDetails.price !== priceDetails.regularPrice && <span className={styles.strike}>{priceDetails.currencyLogo}{priceDetails.regularPrice}</span>}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.heading}>Number of attendees</div>
              <div className={styles.price}>
                {data.attendees}
              </div>
            </div>
            {priceDetails.couponDiscount > 0 &&
              <div className={styles.row}>
                <div className={styles.heading}>Coupon Discount</div>
                <div className={styles.price} style={{ color: '#FB5741' }}>
                  -{priceDetails.currencyLogo}{priceDetails.couponDiscount}
                </div>
              </div>
            }
            <div className={styles.row}>
              <div className={styles.heading}>Sub Total</div>
              <div className={styles.price}>
                {priceDetails.currencyName} {priceDetails.currencyLogo}{priceDetails.subtotal}
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.heading}>Tax and charges</div>
              <div className={styles.price}>
                {priceDetails.currencyName} {priceDetails.currencyLogo}{priceDetails.taxAndCharges}
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
          <div>{priceDetails.currencyName} {priceDetails.currencyLogo}{priceDetails.totalAmount}</div>
        </div>
      )}
    </div>
  );
}
