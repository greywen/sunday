let events = [] as any[];

rrwebRecord({
  emit(event: any) {
    events.push(event);
  },
  recordCanvas: false,
  sampling: {
    input: 'last',
  },
  mouseInteraction: {
    MouseUp: false,
    MouseDown: false,
    Click: true,
    ContextMenu: false,
    DblClick: false,
    Focus: false,
    Blur: false,
    TouchStart: false,
    TouchEnd: false,
  },
});

// setInterval(async () => {
//   await sendPost();
// }, 10000);

// async function sendPost() {
//   if (events.length > 0) {
//     await createRecord(events);
//     events = [];
//   }
// }

// window.addEventListener('beforeunload', () => {
//   let blob = new Blob([`data=${JSON.stringify(events)}`], {
//     type: 'application/x-www-form-urlencoded',
//   });

//   navigator.sendBeacon(`${process.env.API_URL}/v1/record`, blob);
// });
