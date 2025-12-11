import express from 'express';

const app = express()
const port = 3000

app.use(express.static('front-end'));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/orders', (req, res) => {
  res.json([
    { thumb: 'assets/img/box.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },] },
      { thumb: 'assets/img/document.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },] },
      { thumb: 'assets/img/tor.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },] },
      { thumb: 'assets/img/tor.svg', 
      title: 'GL burger - 7-р байр 207', 
      meta: '11/21/25 • 14:00', 
      price: '10,000₮', 
      sub: [
      { name: "Бууз", price: "5000₮" },
      { name: "Сүү", price: "2000₮" },] },
  ]);
})

app.get('/api/products', (req, res) => {
  res.json([
    { id: 1, name: "Кимбаб", price: 5000 },
    { id: 2, name: "Бургер", price: 8000 },
    { id: 3, name: "Бууз", price: 6000 },
    { id: 4, name: "Салад", price: 7000 },
    { id: 5, name: "Кола 0.5л", price: 2000 },
    { id: 6, name: "Хар цай", price: 1500 },
    { id: 7, name: "Кофе", price: 3000 },
    { id: 8, name: "Жүүс 0.33л", price: 2500 },
  ]);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
