import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout";
import Library from "../pages/Library";
import AddBookForm from "../pages/AddBookForm";
import ReviewList from "../pages/ReviewList";
import Home from "../pages/Home";
import BookDetail from "../pages/BookDetail";
import AddReviewForm from "../pages/AddReviewForm"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
        </Route>
        <Route path="/library" element={<Layout />}>
          <Route index element={<Library />} />
        </Route>
        <Route path="/addBook" element={<Layout />}>
          <Route index element={<AddBookForm />} />
        </Route>
        <Route path="/editBook/:id" element={<Layout />}>
          <Route index element={<AddBookForm />} />
        </Route>
        <Route path="/reviews" element={<Layout />}>
          <Route index element={<ReviewList />} />
        </Route>
        <Route path="/books/:id" element={<Layout />}>
          <Route index element={<BookDetail />} />
        </Route>
        <Route path="/reviews/new" element={<Layout />}>
          <Route index element={<AddReviewForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
