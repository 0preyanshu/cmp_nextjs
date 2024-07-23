import React from 'react';
import Payment from '@/components/dashboard/paymentPage/checkout';

function App({searchParams}) {
    return (
        <div className="App">
            <Payment searchParams={searchParams}/>
        </div>
    );
}

export default App;
