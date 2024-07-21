import React, { useState, useEffect, Suspense, lazy } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../farebase/config";

const ApexCharts = lazy(() => import("react-apexcharts"));

interface Recipe {
  title: string;
  cookingTime: number;
}

interface CartItem {
  quantity: number;
  title: string;
}

const Statistics: React.FC = () => {
  const [foodItems, setFoodItems] = useState<Recipe[]>([]);
  const [pieChartOptions, setPieChartOptions] = useState<{
    series: number[];
    options: any;
  }>({
    series: [],
    options: {
      chart: {
        type: "pie",
      },
      labels: [],
      title: {
        text: "Quantity of Food Items by Name",
      },
    },
  });

  const [barChartOptions, setBarChartOptions] = useState<{
    series: { name: string; data: number[] }[];
    options: any;
  }>({
    series: [],
    options: {
      chart: {
        type: "bar",
      },
      xaxis: {
        categories: [],
      },
      title: {
        text: "Preparation Time of Food Items by Name",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch preparation time data from 'recipes'
        const recipesCollectionRef = collection(db, "recipes");
        const recipesSnapshot = await getDocs(recipesCollectionRef);
        const recipesData = recipesSnapshot.docs.map(
          (doc) => doc.data() as Recipe
        );

        setFoodItems(recipesData);

        setBarChartOptions({
          series: [
            {
              name: "Preparation Time",
              data: recipesData.map((item) => item.cookingTime),
            },
          ],
          options: {
            chart: {
              type: "bar",
            },
            xaxis: {
              categories: recipesData.map((item) => item.title),
            },
            title: {
              text: "Preparation Time of Food Items by Name",
            },
          },
        });

        const cartCollectionRef = collection(
          db,
          "carts",
          "EZeoGsq6heZJXia80bV8",
          "items"
        );
        const cartSnapshot = await getDocs(cartCollectionRef);
        const cartData = cartSnapshot.docs.map((doc) => {
          const data = doc.data() as CartItem;
          return { ...data, name: data.title || `Item ${doc.id}` };
        });

        setPieChartOptions({
          series: cartData.map((item) => item.quantity),
          options: {
            chart: {
              type: "pie",
            },
            labels: cartData.map((item) => item.title),
            title: {
              text: "Quantity of Food Items by Name",
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Statistics</h1>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-4">
            Quantity of Food Items by Name
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ApexCharts
              type="pie"
              options={pieChartOptions.options}
              series={pieChartOptions.series}
            />
          </Suspense>
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-xl font-semibold mb-4">
            Preparation Time of Food Items by Name
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ApexCharts
              type="bar"
              options={barChartOptions.options}
              series={barChartOptions.series}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
