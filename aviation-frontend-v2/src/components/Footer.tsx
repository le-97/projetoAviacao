export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#0E1C59] to-[#003DA5] text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="text-center">
            <p className="text-lg font-semibold">
              Prova de Conceito - Embraer
            </p>
            <p className="text-blue-100 text-sm mt-1">
              Desenvolvido por: <span className="font-medium">Letícia Magalhães Caraciole</span>
            </p>
            <p className="text-blue-200 text-xs mt-1">
              CPF: 065.860.541-09
            </p>
          </div>
          <div className="border-t border-white/20 w-full max-w-md mt-4 pt-4">
            <p className="text-center text-blue-100 text-xs">
              © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
