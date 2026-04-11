import React from "react";

import logoImg from "../../../../../../assets/images/logo.jpeg";
  
  const InvoicePDF = React.forwardRef(({ data,company  }, ref) => {
  const today = new Date().toLocaleString();
const todayDate = new Date();
const todayFormatted = todayDate.toLocaleDateString();

  let dueDate = "N/A";
if (data.paymentType?.toLowerCase() === "credit") {
  const due = new Date(todayDate);
  due.setMonth(due.getMonth() + 1); // add 1 month
  dueDate = due.toLocaleDateString();
} else {
  dueDate = todayFormatted; // or leave blank for immediate payment
}

  const subtotal = data.items.reduce((sum, r) => sum + r.qty * r.price, 0);
  const taxTotal = data.items.reduce((sum, r) => sum + (r.qty * r.price * r.tax / 100), 0);
  const total = subtotal + taxTotal;
  
  return (
    <div ref={ref} className="invoice-sheet">

      {/* HEADER */}
      <div className="invoice-header">
         <div className="logo-block">
          <img src={logoImg} alt="Company Logo" className="invoice-logo" />


           <div className="info-grid cut-frame">

  <div class="corner-top-right-h"></div>
  <div class="corner-top-right-v"></div>
  <div class="corner-bottom-left-h"></div>
  <div class="corner-bottom-left-v"></div>
  <div class="corner-bottom-right-h"></div>
  <div class="corner-bottom-right-v"></div>
        <div>
          <p>{data.customer.name}</p>
          <p>{data.customer.customerNo}</p>
          <p>{data.customer.email}</p>
          <p>{data.customer.address}</p>
          
         


           <div className="bottom-grid">
    <div className="grid-item">
      Contact No.: {data.customer.phone}
    </div>
    <div className="grid-item">
      BRN:  {data.customer.brn}
    </div>
    <div className="grid-item">
      Cell No.:  {data.customer.mobile}
    </div>
    <div className="grid-item">
    VAT Code: {data.customer.vat}
    </div>
  </div>
        </div>

        
 


        

       
      </div>

       
        </div>

 <div className="invoice-header-right-grid-column">

  {/* Group 1: VAT Invoice + Original */}
  <div className="invoice-group">
    <div className="invoice-row">
       <div className="invoice-label">VAT Invoice</div>
              <div className="invoice-value invoice-original">{company.address}</div>
    </div>

    <div className="invoice-row">
      <div className="invoice-label">Original</div>
      <div className="invoice-value invoice-original">
                <p>Tel: {company.phone} | Fax: {company.fax}</p>
                <p>Email: {company.email} | Website: {company.website}</p>
                <p>BRN: {company.brn} | VAT REG No: {company.vat}</p>
              </div>
    </div>
  </div>

  {/* Group 2: Invoice meta */}
  <div className="invoice-group">
    <div className="invoice-row">
      <div className="invoice-label">Invoice No:</div>
      <div className="invoice-value">{data.invoiceNo}</div>
    </div>

    <div className="invoice-row">
      <div className="invoice-label">Date:</div>
      <div className="invoice-value">{today}</div>
    </div>

   <div className="invoice-row">
  <div className="invoice-label">Due Date:</div>
  <div className="invoice-value">{dueDate}</div>
</div>
     <div className="invoice-row">
      <div className="invoice-label">Sales Person:</div>
      <div className="invoice-value">{data.seller?.name}</div>
    </div>


     <div className="invoice-row">
      <div className="invoice-label">Payment Term:</div>
      <div className="invoice-value">{data.paymentType}</div>
    </div>


  </div>

</div>
 



      </div>

      {/* CUSTOMER BLOCK */}
     
      {/* TABLE */}
      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Item</th>
            {/* <th>Description</th> */}
            <th>Whs</th>
            <th>Qty</th>
            <th>UOM</th>
            <th>U/Price</th>
            <th>VAT %</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {data.items.map((row, i) => {
           
            // const rowTotal = row.qty * row.price + (row.qty * row.price * row.tax / 100);
            return (
              <tr key={row.id}>
                <td>{i + 1}</td>
                {/* <td>{row.item}</td> */}
                <td>{row.item_name}</td>
                <td>{data.whs}</td>
                <td>{row.qty}</td>
                <td>{data.uom}</td>
                <td>{row.price.toFixed(2)}</td>
                <td>{row.tax??0}%</td>
                <td>{row.subtotal.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="totals">
        <p>Sub Total: {total.toFixed(2)}</p>
        <p>VAT: {taxTotal.toFixed(2)}</p>
        <h3>Total: MUR {total.toFixed(2)}</h3>
      </div>

      {/* FOOTER */}
      <div className="footer">
         <div>
          <p>Terms and Conditions:</p>
          
        </div>
        <div>
          <p>Received the above mentioned goods in good condition.</p>
          <p>Goods once sold are not refundable.</p>
        </div>

        <div className="signatures">
          <p>For SAS Medipro Supplies: ____________________</p>
          <div>
          <p>Received by: ____________________</p>
          <p>Signature:</p>

          </div>
        </div>
      </div>

    </div>
  );
});



export default InvoicePDF;
















//const handleDownload = () => {
//   const opt = {
//     margin: 0,
//     filename: `invoice_${Date.now()}.pdf`,
//     image: { type: "jpeg", quality: 1 },

//     html2canvas: {
//       scale: 3,
//       scrollX: 0,
//       scrollY: 0,
//       windowWidth: 794, // FORCE MATCH WIDTH
//     },

//     jsPDF: {
//       unit: "px",
//       format: [794, 1123], // EXACT A4
//       orientation: "portrait",
//     },
//   };

//   html2pdf().set(opt).from(pdfRef.current).save();
// };
