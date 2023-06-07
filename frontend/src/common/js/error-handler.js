// import PyRequestError from "@/common/js/request";

export default function (err, vm, info) {
  // console.log('error-handler:', err)
  if (err.name === 'PyRequestError') {
    err._error_reminder()
  }
}
