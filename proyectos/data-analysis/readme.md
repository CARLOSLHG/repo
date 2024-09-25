---
title: "Cyclistic Bike-Share Inc."
author: "Carlos Luis Hernández Gutiérrez"
date: "`r Sys.Date()`"
output:
  pdf_document:
    toc: true
    toc_depth: '3'
  html_document:
    toc: true
    toc_depth: 3
    toc_float: true
---

```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = TRUE)
```
\newpage
# <b>Introducción</b>

Este proyecto tiene como objetivo analizar de que formas diferentes los usuarios casuales y los miembros anuales utilizan las bicicletas de Cyclistic. El propósito final es diseñar estrategias de marketing que conviertan a los **usuarios casuales** en **miembros anuales**.

# <b>Objetivos del análisis</b>

-   **Identificar diferencias clave** en los patrones de uso entre usuarios casuales y miembros anuales.
-   **Diseñar estrategias** basadas en datos para mejorar la conversión de usuarios casuales a miembros.
-   **Visualizar tendencias** clave en el uso de las bicicletas por diferentes segmentos de usuarios.

# <b>Descripción de los datos</b>

-   **Periodo de datos**: Q4-2019 y Q1-2020.
-   **Fuentes de datos**: Datos públicos proporcionados por Motivate International Inc.
-   **Variables clave**: Duración del viaje, tipo de usuario, estaciones de inicio y fin, día de la semana.

# <b>Variables</b>

### Variables principales:
<ul><li><b>ride_id:</b> Identificación única para cada viaje.
Nos ayuda a diferenciar cada recorrido.</li>

<li><b>rideable_type:</b> Tipo de bicicleta utilizada (puede ser tradicional, reclinada, etc.).
Nos permite analizar si el tipo de bicicleta tiene algún impacto en el comportamiento de los usuarios.</li>

<li><b>started_at y ended_at:</b> Tiempos de inicio y fin del viaje<br />.
Nos permite calcular la duración del viaje y analizar el comportamiento en diferentes momentos del día, días de la semana o épocas del año.</li>

<li><b>start_station_name y end_station_name:</b> Estaciones de inicio y fin del viaje.<br />
Nos ayuda a identificar los patrones geográficos de uso (aunque podemos no enfocarnos en esto en detalle, puede ser relevante si analizamos zonas más transitadas por un grupo u otro).</li>

<li><b>member_casual:</b> Esta variable es clave, ya que distingue entre los miembros anuales y los usuarios casuales<br />.
Es la variable principal que se utilizará para segmentar los datos.</li>

<li><b>ride_length (calculada):</b> Duración total del viaje (diferencia entre ended_at y started_at).<br />
Esta es una variable muy importante para identificar diferencias en el comportamiento de uso de bicicletas. Analizaremos si los usuarios casuales hacen viajes más largos o más cortos que los miembros.</li>

<li><b>day_of_week (calculada):</b> Día de la semana en que se realizó el viaje.
Esta variable nos permite analizar si hay patrones de uso en ciertos días (por ejemplo, fines de semana vs días laborales).</li>

<li><b>month, day, year (calculadas):</b> Estas columnas nos ayudarán a analizar la estacionalidad, es decir, si el uso varía según el mes o la época del año.<li/></ul>

### Variables opcionales:
<ul><li><b>rideable_type:</b> Puede ser útil si observamos diferencias significativas en el tipo de bicicletas que usan los miembros frente a los usuarios casuales.</li>

<li><b>Estaciones de inicio y fin:</b> Podría ser relevante incluir patrones de origen y destino si queremos descubrir cómo las ubicaciones influyen en el comportamiento.</li></ul>

# <b>Proceso</b>

1.  **Recolección**: Se combinaron los datasets de 2019 y 2020 en un solo conjunto de datos.
2.  **Preparacion**: Se ajustaron los nombres de las columnas para asegurar consistencia entre los años.
3.  **LImpieza**: Se eliminaron observaciones incompletas y duplicadas.
4.  **Análisis**: Se calculó la duración de cada viaje en minutos.
\newpage
### Paso 1: Recoleccion
#### Cargar de datos para el analisis.

Instalación de las librerias necesitadas

```{r instalacion_de_librerias, eval=FALSE}
# Carga de librerias
install.packages("tidyverse")
install.packages("lubridate")
install.packages("janitor")
install.packages("googledrive")
```

LLamamos a las librerias

```{r llamando_librerias, eval=TRUE}
library(tidyverse)
library(lubridate)
library(janitor)
library(conflicted)
library(scales)
library(googledrive)
conflict_prefer("filter", "dplyr")
conflict_prefer("lag", "dplyr")
```

Cargamos los datos

```{r cargar_datos_desde_googledrive, eval=TRUE}
drive_deauth()
drive_download(as_id("https://drive.google.com/file/d/1KeC35my4pIILBh0Yd8RcnNKQe6WPUL-5/view?usp=sharing"), path = "Divvy_Trips_2019_Q4.csv", overwrite = TRUE)

drive_download(as_id("https://drive.google.com/file/d/1KeC35my4pIILBh0Yd8RcnNKQe6WPUL-5/view?usp=sharing"), path = "Divvy_Trips_2019_Q4.csv", overwrite = TRUE)

q1_2019 <- read_csv("Divvy_Trips_2019_Q4.csv")
q1_2020 <- read_csv("Divvy_Trips_2020_Q1.csv")
```

Se comprueban los datos mediante verificaciones.

```{r verificar_datos, eval=FALSE}
# Verificar datos
glimpse(q1_2020)
glimpse(q1_2019)
head(q1_2019)
head(q1_2020)
```

\newpage
### Paso 2: Preparación
#### Preparación de los datos para el analisis.

Comparamos los nombres de las columnas de cada uno de los archivos, Si bien los nombres no tienen que estar en el mismo orden, SÍ deberían coincidir perfectamente antes de que podamos usar un comando para unirlos en un solo archivo.

```{r comparar_los_datos_y_combinarlos_before, eval=TRUE}
colnames(q1_2019)
colnames(q1_2020)
```

Cambiamos el nombre de las columnas para que sean coherentes con q1_2020 (Este será el diseño de tabla futuro para Divvy)
```{r cambiar_nmbres_columnas_coherentes_con_q1_2020, eval=TRUE}
(q1_2019 <- rename(q1_2019
                   ,ride_id = trip_id
                   ,rideable_type = bikeid
                   ,started_at = start_time
                   ,ended_at = end_time
                   ,start_station_name = from_station_name
                   ,start_station_id = from_station_id
                   ,end_station_name = to_station_name
                   ,end_station_id = to_station_id
                   ,member_casual = usertype
))
```

```{r comparar_los_datos_y_combinarlos_after, eval=FALSE}
colnames(q1_2019)
colnames(q1_2020)
```

Verificamos las incongruencias de los datos

```{r verificar_incongruencias, eval=TRUE}
str(q1_2019)
str(q1_2020)
```

Convertimos ride_id y rideable_type en caracteres(chr) para que puedan apilarse correctamente

```{r convertir_ride_id_y_rideable_type_en_chr, eval=TRUE}
q1_2019 <- mutate(q1_2019, ride_id = as.character(ride_id), rideable_type = as.character(rideable_type)) 
```

Agrupamos los trimestres individuales de cada dataset dentro de un gran dataset

```{r agrupar_Datos_en_un_dataset, eval=TRUE}
all_trips <- bind_rows(q1_2019, q1_2020)
```

Eliminamos los campos de latitud, longitud, año de nacimiento y género, ya que estos datos se eliminaron a partir del 2020

```{r eliminar_datos_obsoletos, eval=TRUE} 
all_trips <- all_trips %>%
  select(-c(start_lat, start_lng, end_lat, end_lng, birthyear, gender, tripduration))
```

Hacemos un respaldo de los cambios en el archivo

```{r respaldo_datos_raw, eval=FALSE}
write.csv(all_trips, "20240917_Cyclistic_Data_Raw_v5.csv")
```

\newpage
### Paso 3: Limpieza
#### Limpiar y agregar datos para el análisis

Verificación de la nueva Dataset: Luego preparado los datos, verificamos la nueva dataset creada 

```{r verificar_all_trips_todo, eval=FALSE}
(all_trips) 
```

```{r verificar_all_trips_nombre_columnas, eval=TRUE}
colnames(all_trips)
```

```{r verificar_all_trips_numero de filas, eval=TRUE}
nrow(all_trips)
```
```{r verificar_all_trips_dimensiones, eval=TRUE}
dim(all_trips)
```

```{r verificar_all_trips_primeras_filas, eval=FALSE}
head(all_trips)
```

```{r verificar_all_trips_estructura, eval=FALSE}
str(all_trips)
```

```{r verificar_all_trips_resumen, eval=FALSE}
summary(all_trips)
```

#### Errores detectados:
En la columna <b>"member_casual"</b>, hay dos nombres para los miembros ("member" y "Subscriber") y dos nombres para los pasajeros ocasionales ("Customer" y "casual"). Tendremos que <b>"consolidar las columnas en solo dos nombres de usuarios"</b>.<br />
<i>Antes de 2020, Divvy usaba diferentes etiquetas para estos dos tipos de usuarios, querremos que nuestro marco de datos sea coherente con su nomenclatura actual.</i><br />
Comenzamos verificando cuántas observaciones caen bajo cada tipo de usuario:

```{r verificar_all_trips_member_casual, eval=TRUE}
table(all_trips$member_casual)
```
En la columna "member_casual", reemplazamos "Subscriber" por "member" y "Customer" por "casual"<br />
<i>Usaremos las etiquetas actuales de 2020</i>

```{r reemplazar_valores_member_casual, eval=TRUE}
all_trips <- all_trips %>%
  mutate(member_casual = recode(member_casual,
                                "Subscriber" = "member",
                                "Customer" = "casual"))
```

Verifique que se haya reasignado la cantidad adecuada de observaciones

```{r verificar_cambios_valores_member_casual, eval=TRUE}
table(all_trips$member_casual)
```

Los datos solo se pueden agregar a un<b>"nivel muy agrupado"</b>, lo que es <b>demasiado general</b>. Necesitaremos <b>agregar algunas columnas de datos adicionales</b> (como día, mes, año) que brinden oportunidades adicionales para agregar los datos.<br />

Agregamos columnas que incluyan la fecha, el mes, el día y el año de cada viaje
Esto nos permitirá agregar datos de viajes para cada mes, día o año.<br />
Antes de completada esta operación, solo se podia agregar  los viajes a nivel general.

```{r agregar_columnas_mes_dia_año, eval=TRUE}
all_trips$date <- as.Date(all_trips$started_at) #El formato por defecto será yyyy-mm-dd
all_trips$month <- format(as.Date(all_trips$date), "%m")
all_trips$day <- format(as.Date(all_trips$date), "%d")
all_trips$year <- format(as.Date(all_trips$date), "%Y")
all_trips$day_of_week <- format(as.Date(all_trips$date), "%A")
```

Queremos <b>"agregar un campo calculado"</b> para la duración del recorrido, ya que los datos del primer trimestre de 2020 no tenían la columna "tripduration". Agregaremos <b>"ride_length"</b> a todo el dataset para mantener la coherencia.

```{r agregar_campo_calculado_ride_length, eval=TRUE}
all_trips$ride_length <- difftime(all_trips$ended_at,all_trips$started_at)
```

Inspeccionamos la estructura de las columnas

```{r inspeccion_de_estructura_after_ride_length, eval=TRUE}
str(all_trips)
```

Respaldar el archivo all_trips

```{r respaldar_data_preparacion, eval=FALSE}
write.csv(all_trips, "20240917_cyclistic_data_clean_v5.csv")
```

Convertir "ride_length" a factor numérico para que podamos ejecutar cálculos sobre los datos

```{r convertir ride_length_a_numero, eval=TRUE}
is.factor(all_trips$ride_length)
all_trips$ride_length <- as.numeric(as.character(all_trips$ride_length))
is.numeric(all_trips$ride_length)
```

Hay algunos recorridos en los que la <b>duración del viaje aparece como negativa</b>, incluidos varios cientos de recorridos en los que Divvy sacó bicicletas de circulación por razones de control de calidad. Queremos <b>eliminar estos recorridos</b>.

<b>Eliminar datos "malos"</b>
El marco de datos incluye unos cientos de entradas cuando las bicicletas se sacaron de los muelles y Divvy verificó su calidad o la duración del recorrido fue negativa.<br />

Crearemos una nueva versión del marco de datos (v2) ya que se están eliminando los datos.

```{r creacion_de_dataset_all_trips_v2, eval=TRUE}
all_trips_v2 <- all_trips[!(all_trips$start_station_name == "HQ QR" | all_trips$ride_length < 0),]
```

Verificamos la estructura de all_trips_v2

```{r verificar_estructura_all_trips_v2, eval=TRUE}
str(all_trips_v2)
```

Verificamos las variables ride_length, member_casual y day_of_week en el marco de datos all_trips_v2

```{r resumen_de_ride_length_member_casual_day_of_week, eval=TRUE}
summary(all_trips_v2$ride_length)
summary(all_trips_v2$member_casual)
summary(all_trips_v2$day_of_week)
```

Respaldamos los nuevos datos en un archivo csv

```{r crear_archivo_all_trips_v2.csv, eval=FALSE}
write.csv(all_trips_v2, "all_trips_v2.csv")
```

\newpage
### Paso 4: Analisis
#### Realizar un análisis descriptivo

Debido a una perdida de datos encontrada en la data, (columna day_of_week en all_trips_v2) por un mal formateo de la columna started_at se procedio a reformatearla antes de utilizar la funcion aggregate().

Verificamos si 'started_at' está en el formato de fecha/datetime

```{r reformatear_day_of_week, eval=TRUE}
all_trips_v2$started_at <- as.POSIXct(all_trips_v2$started_at, format = "%Y-%m-%d %H:%M:%S")
```

Comparamos usuarios member vs casual

```{r comparar_member_vs_casual, eval=TRUE}
aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual, FUN = mean)
aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual, FUN = median)
aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual, FUN = max)
aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual, FUN = min)
```

Verificamos el tiempo promedio por viaje para cada dia de la semana por usuario

```{r tiempo_promedio_viajes_dia_usuario, eval=TRUE}
aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual + all_trips_v2$day_of_week, FUN = mean)
```

<b>NOTA:</b>"Level" es una propiedad especial de una columna que se conserva incluso si un subconjunto no contiene ningún valor de un nivel específico.<br />
Notamos que los dias de la semana estan fuera de orden, Necesitamos arreglarlo.

```{r ordenar_dias_Semana, eval=TRUE}
all_trips_v2$day_of_week <- format(as.Date(all_trips_v2$started_at), "%A")
```

(Opcional) Cambiamos el idioma de los días de la semana a español

```{r cambiar_idioma, eval=TRUE}
Sys.setlocale("LC_TIME", "es_ES.UTF-8")
all_trips_v2$day_of_week <- format(as.Date(all_trips_v2$started_at), "%A")
```

Nos aseguramos de que los días están en el orden correcto (opcional)

```{r asegurar_orde_dia_semana, eval=TRUE}
all_trips_v2$day_of_week <- factor(all_trips_v2$day_of_week, 
                                   levels = c("lunes", "martes", "miércoles", 
                                              "jueves", "viernes", "sábado", "domingo"),
                                   ordered = TRUE)
```

Verificación: Asegúrate de que todo está en orden

```{r verificar_orde_dia_semana, eval=TRUE}
summary(all_trips_v2$day_of_week)
```

Ahora verificamos la longitud total de viajes por usuario por dia de semana

```{r promedio_viaje_usuario_dia, eval=TRUE}
aggregate(
  all_trips_v2$ride_length ~ all_trips_v2$member_casual +
  all_trips_v2$day_of_week, FUN = mean)
```

Analizamos los datos de los usuarios por tipo y día de la semana.

```{r analisis_tipo_usuario_dia, eval=TRUE}
all_trips_v2 %>% 
  mutate(weekday = wday(started_at, label = TRUE, abbr = FALSE)) %>%  #creates weekday field  using wday()
  group_by(member_casual, weekday) %>%  #Agrupa por tipo de usuario y día de la semana
  summarise(number_of_rides = n()							#Calcula el número de viajes 
            ,average_duration = mean(ride_length)) %>% 		#Calcula la duración promedio
  arrange(member_casual, weekday)								#Ordena los resultados				
```

\newpage

### Paso 5: Visualizar

#### 1. Duración Promedio de los Viajes por Tipo de Usuario y Día de la Semana

```{r grafico_1_1, eval=TRUE}
all_trips_v2 %>%
  mutate(weekday = format(as.Date(started_at), "%A")) %>%
  group_by(member_casual, weekday) %>%
  summarise(average_duration = mean(ride_length)) %>%
  arrange(member_casual, weekday) -> avg_duration_weekday
```

Ordenamos los días de la semana en español

```{r grafico_1_2, eval=TRUE}
avg_duration_weekday$weekday <- factor(avg_duration_weekday$weekday, 
                                       levels = c("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"))
```

Visualizamos el gráfico

```{r grafico_1_3, eval=TRUE}
ggplot(avg_duration_weekday, aes(x = weekday, y = average_duration / 60, fill = member_casual)) +
  geom_col(position = "dodge", color = "black") +
  geom_text(aes(label = round(average_duration / 60, 1)), vjust = -0.5, position = position_dodge(0.9), size = 3) +
  scale_fill_manual(values = c("member" = "#00BFC4", "casual" = "#F8766D")) +
  labs(title = "Duración Promedio de los Viajes\npor Tipo de Usuario",
       subtitle = "Distribuido por día de la semana",
       x = "Día de la semana", y = "Duración Promedio (minutos)",
       fill = "Tipo de Usuario") +
  theme_minimal() +
  theme(plot.title = element_text(hjust = 0.5, face = "bold", size = 16),
        plot.subtitle = element_text(hjust = 0.5, size = 12),
        axis.title.x = element_text(size = 10, face = "bold"),
        axis.title.y = element_text(size = 10, face = "bold"),
        panel.grid.major = element_line(size = 0.5, linetype = 'dashed'))
```

#### 2. Número de Viajes por Día de la Semana y Tipo de Usuario

Preparamos los datos

```{r grafico_2_1, eval=TRUE}
all_trips_v2 %>%
  mutate(weekday = format(as.Date(started_at), "%A")) %>%
  group_by(member_casual, weekday) %>%
  summarise(number_of_rides = n()) %>%
  arrange(member_casual, weekday) -> trips_by_weekday
```

Ordenamos los días de la semana en español

```{r grafico_2_2, eval=TRUE}
trips_by_weekday$weekday <- factor(trips_by_weekday$weekday, 
                                   levels = c("lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"))
```

Visualizamos el gráfico

```{r grafico_2_3, eval=TRUE}
ggplot(trips_by_weekday, aes(x = weekday, y = number_of_rides, fill = member_casual)) +
  geom_col(position = "dodge", color = "black") +
  geom_text(aes(label = scales::comma(number_of_rides)), vjust = -0.5, position = position_dodge(0.9), size = 3) +
  scale_fill_manual(values = c("member" = "#00BFC4", "casual" = "#F8766D")) +
  labs(title = "Número de Viajes por Día\n de la Semana",
       subtitle = "Comparación entre usuarios casuales y miembros",
       x = "Día de la semana", y = "Número de Viajes",
       fill = "Tipo de Usuario") +
  theme_minimal() +
  theme(plot.title = element_text(hjust = 0.5, face = "bold", size = 16),
        plot.subtitle = element_text(hjust = 0.5, size = 12),
        axis.title.x = element_text(size = 10, face = "bold"),
        axis.title.y = element_text(size = 10, face = "bold"),
        panel.grid.major = element_line(size = 0.5, linetype = 'dashed')) 
```

#### 3. Duración Total de los Viajes por Mes

Preparamos los datos

```{r grafico_3_1, eval=TRUE}
all_trips_v2 %>%
  mutate(month = format(as.Date(started_at), "%Y-%m")) %>%
  group_by(member_casual, month) %>%
  summarise(total_duration = sum(ride_length)) %>%
  arrange(member_casual, month) -> total_duration_month
```

Visualizamos el gráfico

```{r grafico_3_2, eval=TRUE}
ggplot(total_duration_month, aes(x = month, y = total_duration / 60, color = member_casual, group = member_casual)) +
  geom_line(size = 1.2) +
  geom_point(size = 2) +
  scale_color_manual(values = c("member" = "#00BFC4", "casual" = "#F8766D")) +
  labs(title = "Duración Total de los Viajes\npor Mes",
       subtitle = "Comparación entre usuarios casuales y miembros",
       x = "Mes", y = "Duración Total (minutos)",
       color = "Tipo de Usuario") +
  theme_minimal() +
  theme(plot.title = element_text(hjust = 0.5, face = "bold", size = 16),
        plot.subtitle = element_text(hjust = 0.5, size = 12),
        axis.title.x = element_text(size = 10, face = "bold"),
        axis.title.y = element_text(size = 10, face = "bold"),
        axis.text.x = element_text(angle = 45, hjust = 1),
        panel.grid.major = element_line(size = 0.5, linetype = 'dashed'))
```       
        
#### 4. Boxplot de la Distribución de la Duración de los Viajes por Tipo de Usuario

Visualizamos el boxplot

```{r grafico_4_1, eval=TRUE}
ggplot(all_trips_v2, aes(x = member_casual, y = ride_length / 60, fill = member_casual)) +
  geom_boxplot(outlier.colour = "red", outlier.shape = 8, notch = TRUE) +
  scale_fill_manual(values = c("member" = "#00BFC4", "casual" = "#F8766D")) +
  labs(title = "Distribución de la Duración\n de los Viajes por Tipo de Usuario",
       x = "Tipo de Usuario", y = "Duración del Viaje (minutos)",
       fill = "Tipo de Usuario") +
  theme_minimal() +
  theme(plot.title = element_text(hjust = 0.5, face = "bold", size = 16),
        axis.title.x = element_text(size = 10, face = "bold"),
        axis.title.y = element_text(size = 10, face = "bold"),
        panel.grid.major = element_line(size = 0.5, linetype = 'dashed'))
```  

#### 5. Conversión de Usuarios Casuales a Miembros (Gráfico de Embudo)

Supongamos que tenemos datos de conversión a miembros. Este es un ejemplo.

```{r grafico_5_1, eval=TRUE}
conversion_data <- data.frame(
  etapa = c("Usuarios Casual", "Usuarios Frecuentes", "Usuarios Convertidos a Miembros"),
  count = c(100000, 20000, 5000)
)
```

Visualizamos el gráfico de embudo

```{r grafico_5_2, eval=TRUE}
ggplot(conversion_data, aes(x = reorder(etapa, -count), y = count, fill = etapa)) +
  geom_col(width = 0.6) +
  geom_text(aes(label = scales::comma(count)), vjust = -0.5, size = 4) +
  scale_fill_manual(values = c("#F8766D", "#00BFC4", "#A3A500")) +
  labs(title = "Conversión de Usuarios\nCasuales a Miembros",
       x = "Etapa", y = "Cantidad de Usuarios",
       fill = "Usuarios Convertidos a Miembros"
  )
```


\newpage

# <b>Conclusiones</b>

A continuación resumo los puntos mas relevantes a destacar en mis conclusiones para la toma de acciones y análisis futuros.

Estas acciones y análisis adicionales podrían aumentar la retención de usuarios y la conversión de usuarios casuales a miembros anuales, maximizando así el uso del servicio y los ingresos de Cyclistic.

**Conclusión General**

El análisis revela claras diferencias en los patrones de uso entre los usuarios casuales y los miembros anuales de Cyclistic. Los usuarios casuales realizan viajes significativamente más largos que los miembros anuales, tanto en términos de duración promedio como de máximo de tiempo. Estos usuarios también tienden a utilizar más las bicicletas durante los fines de semana, mientras que los miembros anuales muestran un uso más equilibrado entre los días de la semana y los fines de semana.

El objetivo principal del proyecto era entender estas diferencias y diseñar estrategias que promuevan la conversión de usuarios casuales a miembros anuales. Dado que los usuarios casuales prefieren los fines de semana y hacen viajes más largos, parece que usan el sistema más para actividades recreativas, en lugar de fines utilitarios como los miembros anuales.

### Acciones recomendadas

**Promover Membresías Recreativas:** Dado que los usuarios casuales parecen utilizar las bicicletas más por ocio, una estrategia efectiva podría ser crear una membresía especial o una promoción enfocada en fines de semana o actividades recreativas, incentivando así a los usuarios casuales a volverse miembros. Un ejemplo sería una "Membresía de Fin de Semana" con beneficios exclusivos.

**Estaciones en Áreas Recreativas y Turísticas:** Los usuarios casuales parecen estar interesados en realizar viajes más largos, lo que sugiere que podrían estar recorriendo áreas recreativas o turísticas. Se recomienda un análisis geográfico más detallado para identificar zonas de alta demanda recreativa o turística donde Cyclistic podría instalar nuevas estaciones de bicicletas para atraer a más usuarios.

**Mejorar la Experiencia para Viajes Largos:** Como los usuarios casuales realizan viajes considerablemente más largos, Cyclistic podría ofrecer incentivos como tarifas reducidas o servicios adicionales para viajes de mayor duración. Esto podría alentar a los usuarios a aprovechar más las bicicletas sin preocuparse por los costos adicionales de tiempo.

### Futuros Análisis

**Análisis Geoespacial de las Estaciones:** Se podría realizar un análisis geoespacial para identificar posibles zonas donde se requieran más estaciones de bicicletas, especialmente en áreas alejadas del centro o cerca de parques, atracciones turísticas o zonas recreativas donde los usuarios casuales tienden a comenzar y terminar sus viajes.

**Análisis de la Frecuencia de Uso:** Un análisis más detallado del comportamiento de los usuarios casuales que tienen una alta frecuencia de uso (por ejemplo, aquellos que utilizan el servicio más de tres veces al mes) podría revelar características clave para incentivar su conversión a miembros.

**Segmentación Demográfica y Temporal:** Investigar si existen patrones demográficos más detallados o tendencias estacionales que influyan en el uso de bicicletas, como la influencia del clima o eventos específicos que aumentan la demanda de bicicletas, podría ayudar a desarrollar campañas más dirigidas.

<-- FINAL -->
\newpage

# <b>Exportar</b>

Crear un archivo csv que se pueda visualizar en Excel, Tableau, o My Presentación

```{r exportar_datos, eval=FALSE}
counts <- aggregate(all_trips_v2$ride_length ~ all_trips_v2$member_casual + all_trips_v2$day_of_week, FUN = mean)

getwd()
setwd("c://trabajo_final/datos/")

write.csv(counts, file = 'avg_ride_length.csv')
```

Visualizar datos exportados

```{r ver_datos, eval=FALSE}
View(counts)
```
