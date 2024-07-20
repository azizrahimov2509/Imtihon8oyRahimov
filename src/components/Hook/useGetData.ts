// import React, { useEffect, useState } from "react";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../../farebase/config";

// export default function useGetData(collectionName, refresh, filter = "rating") {
//   const [data, setData] = useState([]);
//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState({ status: false, massage: "" });
//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const documents = [];
//         const querySnapshot = await getDocs(collection(db, collectionName));
//         querySnapshot.forEach((doc) => {
//           // console.log(doc.id, " => ", doc.data());
//           // console.log({ id: doc.id, ...doc.data() });
//           documents.push({ id: doc.id, ...doc.data() });
//         });

//         setData(documents);
//       } catch (error) {
//         setError({ status: true, message: error.message });
//       } finally {
//         setIsPending(false);
//       }
//     };
//     getData();
//   }, [refresh]);

//   return { data, isPending, error };
// }
