import React, { FC, useCallback, useEffect, useState } from "react";
import { Food } from "../../components/Food";
import { Header } from "../../components/Header";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import api from "../../services/api";
import { IFood } from "../../types";
import { FoodsContainer } from "./styles";



const Dashboard: FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<IFood>({} as IFood);
    const [foods, setFoods] = useState<IFood[]>([]);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleAddFood = useCallback(
        async (food: IFood) => {
            try {
                const response = await api.post("/foods", {
                    ...food,
                    available: true,
                });

                setFoods([...foods, response.data]);
            } catch (error) {
                console.log(error);
            }
        },
        [foods]
    );

    const handleUpdateFood = useCallback(
        async (food: IFood) => {
            try {
                const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
                    ...editingFood,
                    ...food,
                });

                const foodsUpdated = foods.map((f) =>
                    f.id !== foodUpdated.data.id ? f : foodUpdated.data
                );

                setFoods(foodsUpdated);
            } catch (error) {
                console.log(error);
            }
        },
        [editingFood, foods]
    );

    const handleEditFood = useCallback((food: IFood) => {
        setEditingFood(food);
        setEditModalOpen(true);
    }, []);

    const handleDeleteFood = useCallback(
        async (id) => {
            await api.delete(`/foods/${id}`);

            const foodsFiltered = foods.filter((food) => food.id !== id);

            setFoods(foodsFiltered);
        },
        [foods]
    );

    const toggleModal = useCallback(() => {
        setModalOpen(!modalOpen);
    }, [modalOpen]);

    const toggleEditModal = useCallback(() => {
        setEditModalOpen(!editModalOpen);
    }, [editModalOpen]);

    const loadFoods = useCallback(async () => {
        try {
            const response = await api.get("/foods");
            if (response.data) {
                setFoods(response.data);
            }
        } catch (error) {
            alert(error);
        }
    }, []);

    useEffect(() => {
        loadFoods();
    }, [loadFoods]);

    return (
        <>
            <Header openModal={toggleModal} />
            <ModalAddFood
                isOpen={modalOpen}
                setIsOpen={toggleModal}
                handleAddFood={handleAddFood}
            ></ModalAddFood>
            <ModalEditFood
                isOpen={editModalOpen}
                setIsOpen={toggleEditModal}
                editingFood={editingFood}
                handleUpdateFood={handleUpdateFood}
            />
            <FoodsContainer data-testid="foods-list">
                {foods &&
                    foods.map((food) => (
                        <Food
                            key={food.id}
                            food={food}
                            handleDelete={handleDeleteFood}
                            handleEditFood={handleEditFood}
                        />
                    ))}
            </FoodsContainer>
        </>
    );
};

export { Dashboard };
