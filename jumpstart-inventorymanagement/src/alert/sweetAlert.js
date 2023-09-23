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

export const returnConfirm = async (actions, postActions) => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      actions();
      Swal.fire("Deleted!", "Your file has been deleted.", "success");
      postActions();
    }
  });
};
