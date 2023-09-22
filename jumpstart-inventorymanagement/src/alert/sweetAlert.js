import Swal from "sweetalert2";

export const errorAlert = (errTitle, errMsg) => {
  Swal.fire({
    icon: "error",
    title: `${errTitle}`,
    text: `${errMsg}`,
  }).then(() => {
    window.location.reload();
  });
};

export const successConfAlert = (title, msg) => {
  Swal.fire({
    title: `${title}`,
    text: `${msg}`,
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const successReturnConfAlert = (title, msg) => {
  return Swal.fire({
    title: `${title}`,
    text: `${msg}`,
    icon: "success",
    confirmButtonText: "Ok",
  });
};

export const errorReturnConfAlert = (title, msg) => {
  return Swal.fire({
    title: `${title}`,
    text: `${msg}`,
    icon: "error",
    confirmButtonText: "Ok",
  });
};

export const successReloadAlert = (title, msg, url) => {
  Swal.fire({
    title: `${title}`,
    text: `${msg}`,
    icon: "success",
    confirmButtonText: "Ok",
  }).then(() => {
    window.location.href = url;
  });
};
