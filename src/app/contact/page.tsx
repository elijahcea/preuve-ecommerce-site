export default function Contact() {
  return (
    <main className="flex flex-col gap-2 m-auto px-4 max-w-prose">
      <h1 className="font-semibold text-lg">Contact Us</h1>
      <p className="leading-7">
        Have a question or need assistance? We’ve got you covered: Please reach
        out at <span className="font-semibold">elijah.cea01@gmail.com.</span> We
        aim to respond as quickly as possible, so don’t hesitate to get in
        touch.
      </p>
      <p>
        Like what you see? Vist{" "}
        <a
          className="font-semibold"
          href="https://www.elijahcea.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          elijahcea.com
        </a>{" "}
        for more.
      </p>
    </main>
  );
}
