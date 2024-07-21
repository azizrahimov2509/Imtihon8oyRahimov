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
  console.log(foodItems);

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

        // Fetch quantity data from 'carts'
        const cartCollectionRef = collection(
          db,
          "carts",
          "EZeoGsq6heZJXia80bV8",
          "items"
        );
        const cartSnapshot = await getDocs(cartCollectionRef);
        const cartData = await Promise.all(
          cartSnapshot.docs.map(async (doc) => {
            const data = doc.data() as CartItem;
            const docId = doc.id;
            const title = await fetchTitleFromRecipe(docId);

            return { ...data, title };
          })
        );

        setPieChartOptions({
          series: cartData.map((item) => item.quantity),
          options: {
            chart: {
              type: "pie",
            },
            labels: cartData.map(
              (item) => item.title || `Item ${item.quantity}`
            ),
            title: {
              text: "Quantity of Food Items by Name",
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Function to fetch the title from 'recipes' collection by ID
    const fetchTitleFromRecipe = async (id: string): Promise<string> => {
      try {
        const recipesCollectionRef = collection(db, "recipes");
        const recipesSnapshot = await getDocs(recipesCollectionRef);
        const recipesData = recipesSnapshot.docs.map(
          (doc) =>
            ({ id: doc.id, ...doc.data() } as { id: string; title: string })
        );

        const recipe = recipesData.find((recipe) => recipe.id === id);
        return recipe ? recipe.title : `Item ${id}`;
      } catch (error) {
        console.error("Error fetching title from recipes:", error);
        return `Item ${id}`;
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
