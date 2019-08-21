const acceptablePayments = {
    "entity": "methods",
    "card": true,
    "debit_card": true,
    "credit_card": true,
    "prepaid_card": true,
    "card_networks": {
      "AMEX": 0,
      "DICL": 1,
      "MC": 1,
      "MAES": 1,
      "VISA": 1,
      "JCB": 1,
      "RUPAY": 1,
      "BAJAJ": 0
    },
    "amex": false,
    "netbanking": {
      "AUBL": "AU Small Finance Bank",
      "ABPB": "Aditya Birla Idea Payments Bank",
      "AIRP": "Airtel Payments Bank",
      "ALLA": "Allahabad Bank",
      "ANDB": "Andhra Bank",
      "ANDB_C": "Andhra Bank - Corporate Banking",
      "UTIB": "Axis Bank",
      "BDBL": "Bandhan Bank",
      "BBKM": "Bank of Bahrein and Kuwait",
      "BARB_R": "Bank of Baroda - Retail Banking",
      "BKID": "Bank of India",
      "MAHB": "Bank of Maharashtra",
      "BACB": "Bassein Catholic Co-operative Bank",
      "CNRB": "Canara Bank",
      "CSBK": "Catholic Syrian Bank",
      "CBIN": "Central Bank of India",
      "CIUB": "City Union Bank",
      "CORP": "Corporation Bank",
      "COSB": "Cosmos Co-operative Bank",
      "DCBL": "DCB Bank",
      "BKDN": "Dena Bank",
      "DEUT": "Deutsche Bank",
      "DBSS": "Development Bank of Singapore",
      "DLXB": "Dhanlaxmi Bank",
      "DLXB_C": "Dhanlaxmi Bank - Corporate Banking",
      "ESAF": "ESAF Small Finance Bank",
      "ESFB": "Equitas Small Finance Bank",
      "FDRL": "Federal Bank",
      "HDFC": "HDFC Bank",
      "ICIC": "ICICI Bank",
      "IBKL": "IDBI",
      "IBKL_C": "IDBI - Corporate Banking",
      "IDFB": "IDFC FIRST Bank",
      "IDIB": "Indian Bank",
      "IOBA": "Indian Overseas Bank",
      "INDB": "Indusind Bank",
      "JAKA": "Jammu and Kashmir Bank",
      "JSBP": "Janata Sahakari Bank (Pune)",
      "KCCB": "Kalupur Commercial Co-operative Bank",
      "KJSB": "Kalyan Janata Sahakari Bank",
      "KARB": "Karnataka Bank",
      "KVBL": "Karur Vysya Bank",
      "KKBK": "Kotak Mahindra Bank",
      "LAVB_C": "Lakshmi Vilas Bank - Corporate Banking",
      "LAVB_R": "Lakshmi Vilas Bank - Retail Banking",
      "MSNU": "Mehsana Urban Co-operative Bank",
      "NKGS": "NKGSB Co-operative Bank",
      "NESF": "North East Small Finance Bank",
      "ORBC": "Oriental Bank of Commerce",
      "PMCB": "Punjab & Maharashtra Co-operative Bank",
      "PSIB": "Punjab & Sind Bank",
      "PUNB_R": "Punjab National Bank - Retail Banking",
      "RATN": "RBL Bank",
      "RATN_C": "RBL Bank - Corporate Banking",
      "SRCB": "Saraswat Co-operative Bank",
      "SVCB_C": "Shamrao Vithal Bank - Corporate Banking",
      "SVCB": "Shamrao Vithal Co-operative Bank",
      "SIBL": "South Indian Bank",
      "SCBL": "Standard Chartered Bank",
      "SBBJ": "State Bank of Bikaner and Jaipur",
      "SBHY": "State Bank of Hyderabad",
      "SBIN": "State Bank of India",
      "SBMY": "State Bank of Mysore",
      "STBP": "State Bank of Patiala",
      "SBTR": "State Bank of Travancore",
      "SURY": "Suryoday Small Finance Bank",
      "SYNB": "Syndicate Bank",
      "TMBL": "Tamilnadu Mercantile Bank",
      "TNSC": "Tamilnadu State Apex Co-operative Bank",
      "TBSB": "Thane Bharat Sahakari Bank",
      "TJSB": "Thane Janata Sahakari Bank",
      "UCBA": "UCO Bank",
      "UBIN": "Union Bank of India",
      "UTBI": "United Bank of India",
      "VARA": "Varachha Co-operative Bank",
      "VIJB": "Vijaya Bank",
      "YESB": "Yes Bank",
      "YESB_C": "Yes Bank - Corporate Banking",
      "ZCBL": "Zoroastrian Co-operative Bank"
    },
    "wallet": {
      "payzapp": true,
      "olamoney": true,
      "freecharge": true
    },
    "upi_intent": true
}
export const availableNetBanking = () => {
    let data = acceptablePayments.netbanking;
    let finalData = Object.keys(data).map(function (key) {
    return {
        name: data[key],
        code: key
    };
   });

 console.log(JSON.stringify(finalData));
 return finalData;
}

export const availableWallet = () => {
    let data = acceptablePayments.wallet;
    let finalData = Object.keys(data).map(function (key) {
        if(data[key]) {
            return key;
        }
   });
 console.log(JSON.stringify(finalData));
 return finalData;
}