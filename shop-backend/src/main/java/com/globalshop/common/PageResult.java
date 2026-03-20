package com.globalshop.common;

import lombok.Data;
import java.util.List;

@Data
public class PageResult<T> {
    private List<T> records;
    private Long total;
    private Long current;
    private Long size;

    public static <T> PageResult<T> of(List<T> records, Long total, Long current, Long size) {
        PageResult<T> p = new PageResult<>();
        p.setRecords(records);
        p.setTotal(total);
        p.setCurrent(current);
        p.setSize(size);
        return p;
    }
}
