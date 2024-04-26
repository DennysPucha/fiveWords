"use client";
import { useState, useEffect } from "react";
import { initialWords } from "@/componets/words/Words";
import { TextArea } from "@/componets/forms/TextArea";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import swal from 'sweetalert2';
export default function Home() {

  const [words, setWords] = useState([initialWords]);
  const [text, setText] = useState("");
  const [colorWord, setColorWord] = useState("#FF0000");
  const [enableModal, setEnableModal] = useState(false);

  useEffect(() => {
    const pattern = new RegExp(words[0].map(w => w.word).join('|'), 'i');
    setColorWord(pattern.test(text) ? '#008f4c' : '#FF0000');
  }, [text, words]);

  useEffect(() => {
    const words = localStorage.getItem("words");
    if (words) {
      setWords(JSON.parse(words));
    }
  }, []);

  const validation= yup.object().shape({
    word: yup.string().required("Para guardar una palabra complete el campo"),
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(validation)
  });


  const onSubmit = (data) => {
    const newWord = {
      id: crypto.randomUUID(),
      word: data.word,
    };
    if (words[0].find(w => w.word === newWord.word)) {
      swal.fire({
        title: "La palabra ya existe",
        icon: "error",
      });
      return;
    }
    setWords((prev) => {
      return [prev[0].concat(newWord)];
    });
    setEnableModal(false);
    localStorage.setItem("words", JSON.stringify([words[0].concat(newWord)]));
    swal.fire({
      title: "Palabra agregada",
      icon: "success",
    });
  }


  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="flex flex-col justify-center items-center mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Autómata Básico</h1>
        <div className="ml-3">
          <button
            className="mt-4 bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setEnableModal(true)}
          >
            Añadir Palabras
          </button>
        </div>
      </div>

      <div>
        <form>
          <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Automata</label>
          <TextArea
            id="message"
            rows="4"
            placeholder="Empieza a escribir palabras aqui..."
            onChange={(e) => {
              setText(e.target.value);
            }}
            style={{ color: colorWord }}
          />
          <label for="words" class="mt-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Palabras aceptadas</label>
          <TextArea
            id="words"
            rows="1"
            placeholder="Palabras aceptadas"
            value={words[0].map(w => w.word).join(', ')}
            readOnly
            style={{ color: "008f4c", marginTop: "10px" }}
          />
        </form>
        {enableModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)}>
              <label for="words" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Palabras</label>
              <input {...register("word")} placeholder="Agrega palabras aqui" type="text" id="words" className="block p-2.5 w-full md:w-96 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              <p className="text-red-500 text-xs italic">{errors.word?.message}</p>
              <button
                type="submit"
                className="mt-4 mr-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                Guardar
              </button>
              <button
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setEnableModal(false)}
              >
                Cerrar
              </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
