import BookPage from "@/app/book/[id]/page";
import Modal from "@/components/modal";

//* Modal Intercepting Route
export default function Page(props: any) {
  return (
    <Modal>
      <BookPage {...props} />
    </Modal>
  );
}
