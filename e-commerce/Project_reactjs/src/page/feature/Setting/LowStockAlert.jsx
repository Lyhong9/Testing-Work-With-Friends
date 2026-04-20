import React from 'react'
import "./LowStock.css"
import tele from "../../../../public/telegram-logo-11 (1).png"
const LowStockAlert = () => {
  return (
    <>
      <div className="user-container">  
        <div className="user-header">
          <div>
            <img src={tele} alt="" width={200} height={70}/>
            <span>
              <p className="connect_telegram">Connect your inventory ecosystem to Telegram for real-time critical stock alerts and automated daily summaries.</p>
            </span>
          </div>
        </div>
        <div className="telegram-body">
          <div className="telegram_dis">
            <div className='telegram_disconnected'>
              <div>
                <span>Disconnected</span>
              <span>
                Bot Connection Required
              </span>
              <span>
                To receive alerts, you must first add our automated agent to your preferred communication channel.
              </span>
              </div>
              <div>
                
              </div>
            </div>
          </div>
          <div className='telegram_alert'>

          </div>
        </div>
        </div>
    </>
  )
}

export default LowStockAlert