import Image from 'next/image';
import { Typography } from '@mui/material';
import Styles from './styles/footer.module.scss';

// Hardcoded image paths for Next.js
const paymentImageSrc = '/assets/payment.png';
const paymentImage1Src = '/assets/payment1.png';

// ----------------------------------------------------------------------

export default function PaymentFooter() {
  return (
    <div className={Styles.wrapper}>
      <div className={Styles.footer}>
        <div className={Styles.desktop}>
          <Image src={paymentImageSrc} alt="Payment Methods" width={200} height={100} />
        </div>
        <div className={Styles.mobile}>
          <Image src={paymentImage1Src} alt="Payment Methods" width={200} height={100} />
        </div>
        <Typography variant="body1">
          Transactions on this site are safe, secure & PCI-DSS compliant as indicated by the secure lock in your address bar. Over 500,000+ users like you have enrolled for courses.
        </Typography>
      </div>
      <Typography variant="body2" className={Styles.ssl}>
        This site is <span>SSL SECURED</span>
      </Typography>
    </div>
  );
}
