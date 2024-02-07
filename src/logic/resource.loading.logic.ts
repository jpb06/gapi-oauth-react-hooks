export const loadScript = (
  document: Document,
  id: string,
  jsSrc: string,
  onLoad: () => void,
  onError: () => void,
) => {
  const element = document.getElementsByTagName('script')[0];
  const fjs = element;
  const js = document.createElement('script');
  js.id = id;
  js.src = jsSrc;
  if (fjs?.parentNode) {
    fjs.parentNode.insertBefore(js, fjs);
  } else {
    document.head.appendChild(js);
  }
  js.onload = onLoad;
  js.onerror = onError;
};

export const removeScript = (document: Document, id: string) => {
  const element = document.getElementById(id);

  if (element?.parentNode) {
    element.parentNode.removeChild(element);
  }
};
