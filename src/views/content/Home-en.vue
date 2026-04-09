<template>
<h1>About</h1>
<p>Paituli is a Finnish spatial data service. Paituli is mainly targeted for academic users, but it is open to anyone. The service provides datasets that are important for research and education. Compared to other spatial data services Paituli includes also historical versions of datasets. For many datasets the first version is from 2005, when Paituli started. All provided datasets have open license, mostly CC-BY-4.0 license.

</p>

<p>Finnish academic users are welcomed to <RouterLink to="/opendata">share data</RouterLink> in Paituli.
</p>

<p>
	<a href="http://www.nic.funet.fi/index/geodata/Paituli_2026.pptx" target="_blank">Paituli's PowerPoint presentation</a>
	(2026).
</p>

<h2>Datasets</h2>

<p>
Paituli includes datasets from following data providers:
	<ul>
		<li>
			<a href="https://dvv.fi" target="_blank">Finnish Digital and Population Data Services Agency</a>
		</li>
		<li>
			<a href="https://www.ruokavirasto.fi/" target="_blank">Finnish Food Agency</a>
		</li>
		<li>
			<a href="http://www.ilmatieteenlaitos.fi" target="_blank">Finnish Meteorological Institute (FMI)</a>
		</li>
		<li>
			<a href="http://www.digiroad.fi" target="_blank">Finnish Transport Infrastructure Agency, Digiroad</a>
		</li>
		<li>
			<a href="http://www.kotus.fi" target="_blank">Institute for the Languages of Finland (KOTUS)</a>
		</li>
		<li>
			<a href="https://science.nasa.gov/mission/landsat/" target="_blank">NASA/USGS, Landsat</a>
		</li>
		<li>
			<a href="http://www.maanmittauslaitos.fi" target="_blank">National Land Survey (MML)</a>
		</li>
		<li>
			<a href="https://www.luke.fi/" target="_blank">Natural resource institute Finland (LUKE)</a>
		</li>
		<li>
			<a href="http://www.tilastokeskus.fi/index_en.html" target="_blank">Statistics Finland</a>
		</li>
		<li>
			<a href="https://www.slu.se/en/" target="_blank">Swedish university of agricultural sciences</a>
		</li>		
		<li>
			<a href="https://www.helsinki.fi/en" target="_blank">University of Helsinki</a>
		</li>				
	</ul>
</p>
<p><a href="https://etsin.fairdata.fi/datasets?facet_keyword=Paituli" target="_blank">Detailed list and metadata of all Paituli datasets</a> can be found from Fairdata Etsin. In Etsin, use the free text search or the filters on the left to specify your interest.
</p>

<h2>Data access</h2>

<p>Paituli provides many options for accessing the data:
	<ul>
		<li>
			<RouterLink to="/download">Download page</RouterLink> enables:
			<ul>	
				<li><b>Map preview</b> of many datasets, including feature info.
				</li>
				<li>Downloaded files of all or selected mapsheets as a <b>zip-file</b>, max 3Gb. 
				</li>
				<li>Downloaded file list of all or selected mapsheets. 
				</li>				
			</ul>	
		</li>
		<li>Bigger amounts of data can be download over <RouterLink to="/files">HTTPS, FTP and rsync</RouterLink>.
		</li>
		<li>Many datasets are also available as 
			<RouterLink to="/webservices">OGC APIs:</RouterLink>
			WMS / Maps, WCS / Coverages, WMTS / Tiles and WFS / Features.
		</li>
		<li>All Paituli raster datasets are available via <RouterLink to="/stac">STAC</RouterLink>. Paituli STAC includes more datasets than Paituli download service, for example Geoportti Geocube and several remote sensing Finnish datasets.
		</li>		
		<li>
			<a href="https://research.csc.fi/gis_data_in_csc_computing_env" target="_blank">CSC Puhti supercomputer has open GIS data</a>, which includes a copy of almost all Paituli data, for fast and easy access for Puhti users.
		</li>
	</ul>
</p>


<h2>News</h2>

<table>
	<tbody>
		<tr>
			<th>Date</th>
			<th>News</th>
		</tr>
		<tr>
			<td>18.12.2025</td>
			<td>Statistics Finland: key figures for municipalities 2023 and 2024 added. </td>
		</tr>				
		<tr>
			<td>25.7.2025</td>
			<td>Statistics Finland: population grid data 2024, population by municipalities 2024, road accidents 2023 and Paavo 2025 added.</td>
		</tr>	
		<tr>
			<td>3.6.2025</td>
			<td>FMI's following 10 km datasets have been updated, so that now data is available for years 1961-2024: daily average, mean and maximum temperature, precipitation, snow, radiation, sea level pressure, relative humidity, and monthly average temperature and precipitation. .</td>
		</tr>
		<tr>
			<td>2.6.2025</td>
			<td>Digital Agency: Addresses of buildings 2025 added.</td>
		</tr>			
		<tr>
			<td>30.5.2025</td>
			<td>National Land Survey 2025 data update: topographic database, administrative boundaries, cadastral index map, print-color and background-color basic maps, topographic and general maps in several scales as raster and vector.</td>
		</tr>			
			
		<tr>
			<td>24.5.2025</td>
			<td>Natural Resource institute's (LUKE) estimates of variables in map form from multi-source national forest inventory (MS-NFI) added: 2006 - 2021.</td>
		</tr>				
		<tr>
			<td>15.4.2024</td>
			<td>Over 30 000 historic georeferenced maps from National Land Survey archive from years 1863-2020 added. Parish maps, economic maps, topographic maps and basic maps in scales 1:20 000 to 1:500 000.</td>
		</tr>										
		<tr>
			<td>21.3.2019</td>
			<td>National Land Board's lidar data, 2m DEM and orthophotos are updated every Sunday.</td>
		</tr>			
	</tbody>
</table>

<h2>About Paituli</h2>

<p>The use of Paituli service is free of charge. Paituli is maintained by
	<a href="https://www.csc.fi" target="_blank">CSC - IT center for science</a> and financed by
	<a href="https://minedu.fi/etusivu" target="_blank">Ministry of Education and Culture</a> and 
	Finnish Academy via <a href="https://www.geoportti.fi" target="_blank">Geoportti</a> FIRI-project. Paituli is provided with best effort service level and availability. 
</p>

<p>Paituli is developed at CSC using open source software, inc:
	<a href="http://geoserver.org/" target="_blank">Geoserver</a>,
	<a href="https://openlayers.org/" target="_blank">OpenLayers</a>,
	<a href="https://vuejs.org/" target="_blank">Vue</a>,
	<a href="https://postgis.net/" target="_blank">PostGIS</a>
	and
	<a href="https://quarkus.io/" target="_blank">Quarkus</a>. 		
	Paituli source code is available in Github: 
	<a href="https://github.com/CSCfi/paituli-frontend-vue/"  target="_blank">front-end</a> and <a href="https://github.com/CSCfi/avaa-paituli-backend"  target="_blank">back-end</a>.
</p>

<p>Usage statistics are available in <a href="https://www.nic.funet.fi/index/geodata/yearly_reports/" target="_blank">Paituli yearly reports</a>. 
</p>

</template>