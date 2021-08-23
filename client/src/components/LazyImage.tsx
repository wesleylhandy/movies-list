import React, { useCallback, useEffect, useState } from "react";
import { placeholder } from "./placeholder";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  placeholderImg?: string;
  errorImg?: string;
}

const defaultProps: Pick<ImageProps, "placeholderImg" | "errorImg"> = {
  placeholderImg: placeholder,
  errorImg: placeholder,
};

export function LazyImage({
  src,
  placeholderImg,
  errorImg,
  ...props
}: ImageProps): JSX.Element {
  const [imgSrc, setSrc] = useState(placeholderImg || src);

  const onLoad = useCallback(() => {
    setSrc(src);
  }, [src]);

  const onError = useCallback(() => {
    setSrc(errorImg || placeholderImg);
  }, [errorImg, placeholderImg]);

  useEffect(() => {
    const img = new Image();
    img.src = src as string;
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [src, onLoad, onError]);

  return <img {...props} alt={imgSrc} src={imgSrc} />;
}

LazyImage.defaultProps = defaultProps;
