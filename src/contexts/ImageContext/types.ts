export type ImageType = {
  type: number;
  id: string;
  uri: string;
  filename: string;
  dataFormatada: string;
  favorite: boolean;
};

export interface ImagesContextProps {
  images: ImageType[];
  fetchImages: () => void;
  loading: boolean;
  setImages: React.Dispatch<React.SetStateAction<ImageType[]>>;
  uploadImage: (imageUris: string[], filterName: string) => Promise<{ Ids: string[] } | void>;
  deleteImage: (image: ImageType) => Promise<void>;
  toggleFavorite: (image: ImageType) => Promise<void>;
  selectedFilter: string | null;
  setSelectedFilter: React.Dispatch<React.SetStateAction<string | null>>;
  getProcessamentoPorId: (id: string) => Promise<any>;

  Grayscale: (image: ImageType) => Promise<{ id: string } | void>;
  Negative: (image: ImageType) => Promise<{ id: string } | void>;
  Blur: (image: ImageType, amount: number) => Promise<{ id: string } | void>;
  Canny: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Pixelate: (image: ImageType) => Promise<{ id: string } | void>;
  RGBBoost: (img: ImageType, Amount1: number, amount2: number, amount3: number) => Promise<{ id: string } | void>;
  SkinWhitening: (image: ImageType) => Promise<{ id: string } | void>;
  Heat: (image: ImageType) => Promise<{ id: string } | void>;
  Rescale: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Translate: (img: ImageType, amount1: number, amount2: number) => Promise<{ id: string } | void>;
  Rotate: (img: ImageType, amount: number) => Promise<{ id: string } | void>;
  Cardinal: (img: ImageType, amount: number, amount1: number) => Promise<{ id: string } | void>;
  Crop: (img: ImageType, amount: number, amount1: number, amout3: number, amount4: number) => Promise<{ id: string } | void>;
  Background: (image: ImageType) => Promise<{ id: string } | void>;
}
