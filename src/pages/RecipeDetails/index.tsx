import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../farebase/config";
import { toast } from "react-hot-toast";
import loader from "../../../public/loader.gif";

interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
  ingredients: string[];
  images: string[];
  method: string;
}

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id || "");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() } as Recipe);
        } else {
          toast.error("Recipe not found!");
        }
      } catch (error) {
        console.error("Error fetching recipe details: ", error);
        toast.error("Error fetching recipe details");
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe)
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={loader} alt="Loading..." className="w-16 h-16" />
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Recipe Details
      </h1>
      <hr className="mb-4" />

      <div className="flex gap-2 overflow-x-auto mb-4">
        {recipe.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Image ${index + 1} of ${recipe.title}`}
            className="w-64 h-52 object-cover rounded"
          />
        ))}
      </div>

      <h2 className="text-xl md:text-2xl font-semibold mb-2">{recipe.title}</h2>
      <p className="text-sm md:text-base  mb-4">{recipe.method}</p>
      <div className="flex flex-col md:flex-row items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold mb-2 md:mb-0 md:mr-4">
          Ingredients:
        </h3>
        <div className="flex flex-wrap gap-2">
          {recipe.ingredients.map((ingredient, index) => (
            <p
              key={index}
              className="bg-gray-800 text-white rounded px-2 py-1 text-sm"
            >
              {ingredient}
            </p>
          ))}
        </div>
      </div>
      <p className="text-sm md:text-base font-semibold mt-4">
        Cooking Time: {recipe.cookingTime} minutes
      </p>
      <div className="flex justify-end">
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default RecipeDetails;
