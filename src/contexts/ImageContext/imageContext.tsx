import { createContext, useContext, useState } from 'react';
import Axios from '../../scripts/axios';

interface ImageData {
  id: string;
  url: string;
  title?: string;
  createdAt?: string;
}

interface ImageContextProps {
  images: ImageData[];
  isLoading: boolean;
  uploadImage: (formData: FormData) => Promise<any>;
  fetchImages: () => Promise<void>;
  deleteImage: (id: string) => Promise<void>;
}

const ImageContext = createContext<ImageContextProps>({
  images: [],
  isLoading: false,
  uploadImage: async () => {},
  fetchImages: async () => {},
  deleteImage: async () => {},
});

export const useImage = () => {
  return useContext(ImageContext);
};

export const ImageProvider = ({ children }: any) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchImages = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(`/images`); 
      setImages(response.data);
      alert(response.data)
    } catch (error) {
      console.error("Erro ao buscar imagens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImage = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const response = await Axios.post(`/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await fetchImages(); 
      return response;
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      return { error: true, msg: "Erro ao fazer upload" };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async () => {
    try {
      setIsLoading(true);
      await Axios.delete(`/images`);
      await fetchImages();
    } catch (error) {
      console.error("Erro ao deletar imagem:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageContext.Provider value={{ images, isLoading, uploadImage, fetchImages, deleteImage }}>
      {children}
    </ImageContext.Provider>
  );
};
