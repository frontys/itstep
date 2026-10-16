#include <iostream>
using namespace std;

void even() {
    int arr[5] = {1, 2, 3, 4, 5};
    int arr2[5] = {1, 2, 3, 4, 5};
    int arr3[10];
    int k = 0;
    
    for (int f = 0; f < 5; f++) {
        if (arr[f] % 2 == 0) {
            arr3[k] = arr[f];
            k++;
        }
    } 
    
    for (int f = 0; f < 5; f++) {
        if (arr2[f] % 2 == 0) {
            arr3[k] = arr2[f];
            k++;
        }
    }
    
    for (int f = 0; f < k; f++) {
        cout << arr3[f] << " "; 
    }
    cout << endl;
}

int main() {
    even();
}
