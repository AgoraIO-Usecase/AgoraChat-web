import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import "./imageCrop.scss";
import { Button, Modal, ModalProps } from "agora-chat-uikit";
import getCroppedImg from "../../utils/cropImg";
const dogImg =
  "https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000";

interface ImageCropProps extends ModalProps {
  onUpload?: (img: string) => void;
  onCancel?: () => void;
  img?: string;
}

const ImageCrop = (props: ImageCropProps) => {
  const { onUpload, onCancel, img = "", ...others } = props;
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const onCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const getImage = async () => {
    const imgUrl = await getCroppedImg(img, croppedAreaPixels, 0);
    onUpload?.(imgUrl as string);
    others?.onOk?.(imgUrl as any);
  };
  return (
    <Modal
      {...others}
      onOk={getImage}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <div className="crop-container">
        <Cropper
          image={img}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        {/* <div className="crop-toolBox">
          <Button type="primary" onClick={getImage}>
            Upload
          </Button>
          <Button
            type="default"
            onClick={() => {
              onCancel?.();
            }}
          >
            Cancel
          </Button>
        </div> */}
      </div>
    </Modal>
  );
};
export default ImageCrop;
