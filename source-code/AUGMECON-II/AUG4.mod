#********************************************************************
#  	multi-depot Cumulative Capacitated Vehicle Routing Problem  *
#********************************************************************

#*****************************************************
#	          Parámetros a utilizar	                *
#*****************************************************

param m; #Numero de orígenes
param n;	# numero de clientes
#param r; 	#número de reparadores
param K;	#cantidad máxima de reparadores (maximo de todos los orígenes)
param L;
param N := L + 1;	#Tamaño de la red
param Q;	#Duracion maxima del viaje
param D;


#*****************************************************
#	          Conjuntos a utilizar	                *
#*****************************************************

set origenes = 1..m;
set clientes=0..n; 		#Conjunto de clientes incluyendo el depósito
set niveles=1..N;		#Cantidad de niveles de la red multinivel
set reparadores=1..K;	#Conjunto de reparadores requeridos (se utilizan todos)

#*****************************************************
#	          Variables a utilizar	             *
#*****************************************************
var x{clientes, niveles} binary; # Variable que controla los niveles
var y{clientes, clientes, niveles} binary; # Variable que controla el flujo de arcos entre nodos
var w{origenes, clientes, niveles} binary;
var v{origenes, clientes} >=0;
var l{clientes, clientes} >=0;
var z{origenes} binary;
var S >=0;

#*****************************************************
#	       Parámetros adicionales	             *
#*****************************************************
#param q{clientes} >=0; #parametro de demanda
param cost{clientes, clientes}>=0; #distancias del cliente i y el cliente j
param o{origenes, clientes} >=0;
param cc{origenes, reparadores};	#
param HC{origenes}; #Costo de contratación por origen
param d{clientes};

#*****************************************************
#	       Modelacion del Problema	             *
#*****************************************************

minimize Latencia:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} (k*w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} (k*y[i,j,k]));

minimize Distancia:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} (w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} (y[i,j,k]));

minimize Biobjetivo:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} (k*w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} (k*y[i,j,k])) - e*(S/r2);

#*****************************************************
#  	          Restricciones AUGMECON	             *
#*****************************************************

subject to latencia_total:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} k*(w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} k*(y[i,j,k])) <= eps0;

subject to distancia_total:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} (w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} (y[i,j,k])) <= eps1;

subject to distancia_total_aug:
sum{i in origenes, j in clientes: j>0} o[i,j] * (sum{k in niveles} (w[i,j,k])) + sum{i in clientes, j in clientes: 0<i<>j>0} cost[i,j]*(sum{k in niveles: k < N} (y[i,j,k])) + S = eps2;

#*****************************************************
#  	          Restricciones MODELO BIOBJ             *
#*****************************************************

subject to asignacion_clientes{i in clientes: i>0}:
sum{k in niveles} x[i,k] = 1;

subject to asignacion_inicio:
sum{i in clientes: i>0} x[i,1] <= K;

subject to asignacion_inicio_final:
sum{k in niveles, j in clientes: 0 < j} y[0, j, k] = sum{i in clientes: i>0} x[i,1];

subject to asignacion_clientes1{i in clientes, k in niveles: k < N}:
sum{j in clientes: 0<j<>i>0} y[i,j,k] = x[i, k+1];

subject to inicializacion{j in clientes, k in niveles: j > 0 and k<N}:
y[0,j,k] + sum{i in clientes: 0<i<>j} y[i,j,k] = x[j,k];

subject to final{j in clientes: j>0}:
y[0,j,N] = x[j,N];

subject to subtours{j in clientes, k in niveles: j > 0 and 1<k<N}:
sum{i in clientes: i>0} y[i, j, k] - sum{i in clientes: i>0} y[j, i, k-1] = 0;

subject to bound1{i in clientes, j in clientes, k in niveles: 0<i<>j>0 and 1<k<N}:
y[i, j, k] + y[j, i, k] <= 1;

subject to inicio{j in clientes, k in niveles: j>0}:
sum{i in origenes} w[i,j,k] = y[0,j,k];

subject to activation{i in origenes, j in clientes, k in niveles: j>0}:
z[i]>=w[i,j,k];

#subject to limit_repairmen {i in origenes}:
#sum{j in clientes, k in niveles: j>0} w[i,j,k]<=Max; #Sirve para colocar un subconjunto para cada tipo de origen que denote el máximo de operadores disponibles para cada punto de origen

subject to init_demand_route{i in origenes, j in clientes: j>0}:
v[i,j] >= d[j]*sum{k in niveles}w[i,j,k];

subject to ub_demand_route{i in origenes, j in clientes: j>0}:
v[i,j] <= Q*sum{k in niveles}w[i,j,k];

subject to lb_demand{i in clientes, j in clientes: i<>j>0}:
l[i,j] >= d[j]*sum{k in niveles}y[i,j,k];

subject to ub_demand{i in clientes, j in clientes:0<i<>j>0}:
l[i,j] <= (Q-d[i])*sum{k in niveles: k<N} y[i,j,k];

subject to demand_flow{i in clientes: i>0}:
sum{h in origenes} v[h,i] + sum{j in clientes: i<>j>0} l[j,i] - sum{j in clientes: i<>j>0} l[i,j] = d[i];

