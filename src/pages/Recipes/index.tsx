import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../farebase/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import loader from "../../../public/loader.gif";

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
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"));
        const recipesData = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Recipe)
        );
        setRecipes(recipesData);
      } catch (error) {
        console.error("Error fetching recipes: ", error);
        toast.error("Error fetching recipes");
      } finally {
        setLoading(false);
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
          position: "top-right",
          className: "bg-red-500 text-white",
        });
      } catch (error) {
        console.error("Error deleting recipe: ", error);
      }
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/recipes/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl pb-2 font-semibold">Recipes</h1>
      <hr className="mb-4" />
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <img
            src={loader}
            alt="Loading..."
            width={384}
            height={384}
            className="w-96 h-96"
          />
        </div>
      ) : recipes.length === 0 ? (
        <p className="text-center text-lg">There are no recipes!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              className="border p-3 rounded-md relative  shadow-sm cursor-pointer flex flex-col justify-between gap-5 h-80  "
              onClick={() => handleCardClick(recipe.id)}
            >
              <button
                type="button"
                className="absolute top-2 right-2 text-red-500 text-2xl  rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id);
                }}
              >
                ×
              </button>
              <div className="flex-1 overflow-hidden flex flex-col justify-between ">
                <h2 className="text-lg font-semibold mb-2">{recipe.title}</h2>
                <p className="text-sm mb-2 line-clamp-3">{recipe.method}</p>
                <div className="flex items-center justify-end gap-1 text-sm text-gray-600">
                  <span className="indicator-item badge badge-primary">
                    new
                  </span>
                  <p className="bg-fuchsia-300 rounded-full px-2 py-1 flex items-center gap-1">
                    <FaClock size={14} color="blue" /> {recipe.cookingTime}{" "}
                    minutes
                  </p>
                </div>{" "}
                {recipe.images.length > 0 && (
                  <img
                    src={recipe.images[0]}
                    alt={recipe.title}
                    className="w-full h-36 object-cover rounded"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recipes;
