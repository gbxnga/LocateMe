# LocateMe
A GhanaPostGPS clone which uses GoogleMaps API to generate an address for every 5 x 5 area in Ghana (works almost completely) 

In the end of last year (2017), the government released a digital addressing project called (GhanaPost)[https://www.ghanaweb.com/GhanaHomePage/NewsArchive/Step-by-step-guide-How-to-register-on-Digital-Address-system-other-things-to-know-592296]. Basically the idea was to give a unique adddress 
to every 5m x 5m area. The project was estimated approx [Ghc3,500,000!](https://www.pulse.com.gh/news/local/digital-addressing-system-ghana-post-blows-ghc3-5-million-on-publicity-to-market-digital-addressing-app-id7523041.html]). I researched and found out the contractor (Vokacom Ltd) uses Google Maps API
to deal with this problem. 

My inner scientists tingled and here's my attempt to recreate the Ghc3,500,000 GhanaPost system...
Results were encouraging, I managed to generate most of the code. The challenge was getting the last 4 digits which are uniquely assigned 
and which algorithm I'm not so sure the contractor uses to generate this
