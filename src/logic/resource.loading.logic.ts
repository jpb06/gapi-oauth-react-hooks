export const loadScript = (
  document: HTMLDocument,
  id: string,
  jsSrc: string,
  callback: () => void
) => {
  const element = document.getElementsByTagName("script")[0];
  const fjs = element;
  let js = element;
  js = document.createElement("script");
  js.id = id;
  js.src = jsSrc;
  if (fjs && fjs.parentNode) {
    fjs.parentNode.insertBefore(js, fjs);
  } else {
    document.head.appendChild(js);
  }
  js.onload = callback;
};

export const removeScript = (document: HTMLDocument, id: string) => {
  const element = document.getElementById(id);

  if (element) {
    element.parentNode?.removeChild(element);
  }
};
