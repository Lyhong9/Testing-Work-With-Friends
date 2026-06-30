import { QRCodeSVG } from "qrcode.react";
import UseSalePos from "./UseSalePos";

const GenerateKhqr = () => {
  const { Datakhqr } = UseSalePos();

  return (
    <div className="border-2 border-gray-300 rounded-lg p-4 text-center">
      <QRCodeSVG
    value={Datakhqr?.qr}
    size={300}
    level="H"
/>
    </div>
  );
};

export default GenerateKhqr;