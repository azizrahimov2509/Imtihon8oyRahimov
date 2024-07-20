import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../farebase/config";

interface RecipeModalProps {
  setRefresh: () => void;
}

interface Ingredient {
  id: number;
  value: string;
}

interface Image {
  id: number;
  value: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ setRefresh }) => {
  const [title, setTitle] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [method, setMethod] = useState("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (ingredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    if (images.length === 0) {
      alert("Please add at least one image URL.");
      return;
    }

    const recipeData = {
      title,
      cookingTime: parseInt(cookingTime, 10),
      ingredients: ingredients.map((ingredient) => ingredient.value),
      images: images.map((image) => image.value),
      method,
    };

    try {
      setLoading(true);
      const docRef = await addDoc(collection(db, "recipes"), recipeData);
      console.log(docRef);
      toast.success("Recipe added successfully!", {
        autoClose: 2000,
      });
      setTitle("");
      setCookingTime("");
      setIngredients([]);
      setImages([]);
      setMethod("");
      setIngredientInput("");
      setImageInput("");
      setRefresh();
      document.getElementById("recipe_modal")?.closest("dialog")?.close();
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Error adding recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    if (ingredientInput) {
      const newIngredients = ingredientInput
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value)
        .map((value) => ({ id: Date.now(), value }));

      setIngredients([...ingredients, ...newIngredients]);
      setIngredientInput("");
    }
  };

  const addImage = () => {
    if (imageInput) {
      setImages([...images, { id: Date.now(), value: imageInput }]);
      setImageInput("");
    }
  };

  return (
    <>
      <dialog id="recipe_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-5 text-center">
            Create a Recipe
          </h3>
          <form
            className="flex flex-col items-center w-full"
            onSubmit={handleSubmit}
          >
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">
                  Recipe Title <span className="text-red-500">*</span>
                </span>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Enter recipe title..."
                className="input input-bordered input-md w-full input-primary"
                required
              />
            </label>
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">
                  Cooking Time (minutes) <span className="text-red-500">*</span>
                </span>
              </div>
              <input
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                type="number"
                placeholder="Enter cooking time..."
                className="input input-bordered input-md w-full input-primary"
                required
              />
            </label>
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">
                  Ingredients <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="flex items-center">
                <input
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  type="text"
                  placeholder="Add ingredients (comma separated)..."
                  className="input input-bordered input-md w-full input-primary"
                />
                <button
                  type="button"
                  className="btn btn-sm ml-2"
                  onClick={addIngredient}
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                {ingredients.map((ingredient) => (
                  <span
                    key={ingredient.id}
                    className="badge badge-primary mr-2 mb-2 bg-transparent border border-primary text-primary"
                  >
                    {ingredient.value}
                  </span>
                ))}
              </div>
            </label>
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">
                  Image URLs <span className="text-red-500">*</span>
                </span>
              </div>
              <div className="flex items-center">
                <input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  type="text"
                  placeholder="Add an image URL..."
                  className="input input-bordered input-md w-full input-primary"
                />
                <button
                  type="button"
                  className="btn btn-sm ml-2"
                  onClick={addImage}
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap">
                {images.map((image) => (
                  <img
                    key={image.id}
                    src={image.value}
                    alt={`Image ${image.id}`}
                    className="w-16 h-16 object-cover mb-2 mr-2"
                  />
                ))}
              </div>
            </label>
            <label className="form-control w-full max-w-xs mb-3">
              <div className="label">
                <span className="label-text">
                  Method <span className="text-red-500">*</span>
                </span>
              </div>
              <textarea
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                placeholder="Enter method..."
                className="textarea textarea-bordered textarea-md w-full input-primary"
                required
              ></textarea>
            </label>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="btn btn-outline btn-primary"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-secondary"
                onClick={() => setShowPreview(true)}
              >
                Preview
              </button>
            </div>
            {loading && <div className="mt-4 text-center">Loading...</div>}
          </form>
        </div>
        {showPreview && (
          <div className="modal-overlay">
            <PreviewModal
              title={title}
              cookingTime={cookingTime}
              ingredients={ingredients}
              images={images}
              method={method}
              onClose={() => setShowPreview(false)}
            />
          </div>
        )}
      </dialog>
      <ToastContainer />
    </>
  );
};

interface PreviewModalProps {
  title: string;
  cookingTime: string;
  ingredients: Ingredient[];
  images: Image[];
  method: string;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({
  title,
  cookingTime,
  ingredients,
  images,
  method,
  onClose,
}) => {
  return (
    <dialog open className="modal modal-preview">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg mb-5 text-center">Recipe Preview</h3>
        <div className="flex">
          <div className="w-1/3">
            {images[0] && (
              <img
                src={images[0].value}
                alt="Preview"
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="w-2/3 ml-4">
            <h4 className="text-xl font-semibold">{title}</h4>
            <p className="mt-2">Cooking Time: {cookingTime} minutes</p>
            <h5 className="mt-4 font-semibold">Ingredients:</h5>
            <ul className="list-disc list-inside">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>{ingredient.value}</li>
              ))}
            </ul>
            <h5 className="mt-4 font-semibold">Method:</h5>
            <p>{method}</p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default RecipeModal;
