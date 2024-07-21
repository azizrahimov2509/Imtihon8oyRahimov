import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../farebase/config";
import { toast } from "react-hot-toast";
import loader from "../../../public/loader.gif";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/cartSlice";

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const handleAddToCart = () => {
    if (recipe) {
      const photoURL = recipe.images[currentImageIndex];
      dispatch(addToCart({ ...recipe, quantity: 1, photoURL }));
      toast.success("Added to cart!");
    }
  };

  const handleNextImage = () => {
    if (recipe) {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % recipe.images.length
      );
    }
  };

  const handlePreviousImage = () => {
    if (recipe) {
      setCurrentImageIndex(
        (prevIndex) =>
          (prevIndex - 1 + recipe.images.length) % recipe.images.length
      );
    }
  };

  if (!recipe)
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={loader} alt="Loading..." className="w-96 h-96" />
      </div>
    );

  return (
    <div className="container mx-auto p-4 md:p-8 relative">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">
        Recipe Details
      </h1>
      <hr className="mb-4" />

      {recipe.images.length > 0 && (
        <div className="relative mb-4">
          <img
            src={recipe.images[currentImageIndex]}
            alt={`Image ${currentImageIndex + 1} of ${recipe.title}`}
            className="w-full h-96 object-cover rounded"
          />
          <button
            className="absolute top-1/2 left-0 transform -translate-y-1/2 btn-primary bg-gray-800 text-white p-2 rounded-l"
            onClick={handlePreviousImage}
          >
            Previous
          </button>
          <button
            className="absolute top-1/2 right-0 transform -translate-y-1/2 btn-primary bg-gray-800 text-white p-2 rounded-r"
            onClick={handleNextImage}
          >
            Next
          </button>
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-semibold mb-2">{recipe.title}</h2>
      <p className="text-sm md:text-base mb-4">{recipe.method}</p>
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
