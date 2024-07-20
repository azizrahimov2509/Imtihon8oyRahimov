import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../farebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClock } from "react-icons/fa";

interface Recipe {
  id: string;
  title: string;
  cookingTime: number;
  ingredients: string[];
  images: string[];
  method: string;
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Recipe)
        );
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
      }
    };

    fetchRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "recipes", id));
        setRecipes(recipes.filter((recipe) => recipe.id !== id));
        toast.success("Recipe has been deleted!", {
          autoClose: 2000,
          position: "top-right",
          className: "bg-red-500 text-white",
        });
      } catch (error) {
        console.error("Error deleting recipe: ", error);
      }
    }
  };

  return (
    <div className="container">
      <h1 className="text-3xl pb-2">Recipes</h1>
      <hr />
      {recipes.length === 0 ? (
        <p className="text-center mt-4">There are no recipes!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="border p-4 rounded relative">
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 text-2xl bg-white rounded-full p-1"
                onClick={() => handleDelete(recipe.id)}
              >
                ×
              </button>
              <div className="mb-4">
                <h2 className="text-xl font-bold">{recipe.title}</h2>
                <p className="text-gray-600">
                  Cooking Time: <FaClock size={14} color="blue" />{" "}
                  {recipe.cookingTime} minutes
                </p>
                <ul className="mt-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-800">
                      - {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              {recipe.images.length > 0 && (
                <div className="relative">
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Recipes;
