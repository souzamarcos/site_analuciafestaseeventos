# Site de Ana Lúcia Festas e Eventos
Páginas estáticas necessárias para o funcionamento do site. [Ver aqui](https://analuciafestaseeventos.com.br/)


Site está sendo hospedado pelo próprio Github.

Os arquivos do site minificados vão ficar disponíveis na pasta "/docs"

As imagens da página "/fotos" devem ser adicionadas no diretório "src/assets/img/fotos" e após deve rodar a task "build" do gulp para gerar as thumbnails e atualizar o arquivo [fotos.json](google.com)

# Tecnologias
* [gulp](https://gulpjs.com/)
* [jQuery](https://jquery.com/)
* [PhotoSwipe](https://photoswipe.com/)
* [ImageMagick](https://imagemagick.org/script/download.php)

# Buildar site
Instale o [photoSwipe](https://photoswipe.com/)

* Ubuntu 
```
apt-get install imagemagick
apt-get install graphicsmagick
```

* Windows: Instale o [ImageMagick](https://imagemagick.org/script/download.php) e o [GraphicsMagick](ftp://ftp.graphicsmagick.org/pub/GraphicsMagick/windows/)


Instale o gulp globalmente

```
npm install --global gulp-cli
```

Instale as dependências do npm
```
npm install
```

Agora é só rodar o gulp
```
gulp build
```